import { useEffect, useMemo, useState } from "react";
import { useRecommendation } from "../../convexHooks";
import { productFor } from "../../selectors";
import { LEGACY_DEFAULT_BRIEF, STYLE_OPTIONS } from "../../state";
import type { ProductCategory, SourceFilter } from "../../types";
import type { NodeProps } from "../nodeProps";

const CATEGORY_LABELS: { id: ProductCategory; label: string }[] = [
  { id: "home-textiles", label: "Home textiles" },
  { id: "garments-accessories", label: "Garments / accessories" },
  { id: "unfinished-material", label: "Unfinished material" },
];

interface DbRow {
  readonly product_id?: string;
  readonly source_url?: string;
  readonly title?: string;
  readonly source_product_label?: string;
  readonly category?: string;
  readonly subcategory?: string;
  readonly material_or_fibre?: string;
  readonly composition?: string;
  readonly source_seller?: string;
  readonly source_platform?: string;
  readonly searchable_text?: string;
  readonly search_keywords?: string;
  readonly brands?: string;
  readonly aesthetic_tags?: string;
  readonly style_features?: string;
  readonly deadstock_status?: string;
  readonly stock_origin?: string;
  readonly production_method?: string;
  readonly product_type?: string;
}

interface DbEntry {
  readonly row: DbRow;
  readonly searchable: string;
  readonly terms: readonly string[];
}

interface DbMatch {
  readonly id: string;
  readonly title: string;
  readonly category: string;
  readonly subcategory: string;
  readonly material: string;
  readonly seller: string;
  readonly productSlug: string | null;
  readonly source: SourceFilter | null;
  readonly score: number;
  readonly matchedTokens: number;
}

const STOP_WORDS: Readonly<Record<string, true>> = {
  a: true,
  an: true,
  and: true,
  or: true,
  the: true,
  for: true,
  with: true,
  from: true,
  to: true,
  of: true,
  in: true,
  on: true,
  at: true,
  by: true,
  make: true,
  want: true,
  need: true,
  using: true,
  use: true,
  my: true,
  our: true,
};

const TOKEN_ALIASES: Readonly<Record<string, string>> = {
  totes: "tote",
  bags: "bag",
  tshirts: "tshirt",
  tees: "tshirt",
  jackets: "jacket",
  linens: "linen",
  tablecloths: "tablecloth",
};

const TOKEN_SYNONYMS: Readonly<Record<string, readonly string[]>> = {
  tote: ["bag"],
  bag: ["tote"],
  tshirt: ["tee"],
  tee: ["tshirt"],
  jacket: ["coat"],
  coat: ["jacket"],
};

function normalizeToken(token: string): string {
  const lower = token.toLowerCase();
  return TOKEN_ALIASES[lower] ?? lower;
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .map(normalizeToken)
    .filter((token) => token.length > 1 && !STOP_WORDS[token]);
}

function tokenVariants(token: string): string[] {
  return [token, ...(TOKEN_SYNONYMS[token] ?? [])];
}

function editDistanceLeq(a: string, b: string, maxDistance: number): boolean {
  if (Math.abs(a.length - b.length) > maxDistance) {
    return false;
  }
  if (a === b) {
    return true;
  }
  const previous = new Array<number>(b.length + 1);
  for (let index = 0; index <= b.length; index += 1) {
    previous[index] = index;
  }
  for (let i = 1; i <= a.length; i += 1) {
    let current0 = i;
    let rowMin = current0;
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1;
      const current = Math.min(
        (previous[j] ?? 0) + 1,
        current0 + 1,
        (previous[j - 1] ?? 0) + cost,
      );
      previous[j - 1] = current0;
      current0 = current;
      if (current < rowMin) {
        rowMin = current;
      }
    }
    previous[b.length] = current0;
    if (rowMin > maxDistance) {
      return false;
    }
  }
  return (previous[b.length] ?? maxDistance + 1) <= maxDistance;
}

function fuzzyTokenInTerms(token: string, terms: readonly string[]): boolean {
  return terms.some((term) => {
    if (term.length < 3) {
      return false;
    }
    if (Math.abs(term.length - token.length) > 1) {
      return false;
    }
    if (!term.startsWith(token.charAt(0))) {
      return false;
    }
    return editDistanceLeq(token, term, 1);
  });
}

function inferProductSlug(row: DbRow): string | null {
  const hay = [row.title, row.subcategory, row.category, row.search_keywords]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  const productType = (row.product_type ?? "").toLowerCase();
  const category = (row.category ?? "").toLowerCase();

  if (hay.includes("tablecloth")) return "tablecloth";
  if (hay.includes("cushion")) return "cushion-cover";
  if (hay.includes("curtain")) return "curtain";
  if (hay.includes("apron")) return "apron";
  if (hay.includes("scarf")) return "scarf";
  if (hay.includes("pouch")) return "pouch";
  if (hay.includes("bandana")) return "bandana";
  if (hay.includes("fabric roll") || hay.includes("roll of fabric"))
    return "fabric-roll";
  if (
    hay.includes("panel lot") ||
    hay.includes("fabric panel") ||
    hay.includes("textile panel")
  )
    return "panel-lot";
  if (
    (hay.includes("material bundle") ||
      hay.includes("fabric bundle") ||
      hay.includes("textile bundle")) &&
    !productType.includes("garment")
  ) {
    return "material-bundle";
  }
  if (hay.includes("tote")) return "tote-bag";
  if (hay.includes("bag") && category.includes("accessories"))
    return "tote-bag";
  return null;
}

function inferSource(row: DbRow): SourceFilter | null {
  const deadstock = (row.deadstock_status ?? "").toLowerCase();
  if (deadstock === "yes") {
    return "deadstock";
  }
  const origin = (
    row.stock_origin ??
    row.production_method ??
    ""
  ).toLowerCase();
  if (
    origin.includes("pre-owned") ||
    origin.includes("vintage") ||
    origin.includes("reclaimed") ||
    origin.includes("upcycled")
  ) {
    return "reclaimed";
  }
  return null;
}

function scoreMatches(entries: readonly DbEntry[], brief: string): DbMatch[] {
  const tokens = tokenize(brief);
  if (tokens.length === 0) {
    return [];
  }
  const requiredMatches = tokens.length >= 3 ? 2 : 1;
  const minScore = tokens.length >= 3 ? 6 : 3;

  return entries
    .map((entry) => {
      const row = entry.row;
      let score = 0;
      let matchedTokens = 0;

      for (const token of tokens) {
        let matched = false;
        for (const variant of tokenVariants(token)) {
          if (entry.searchable.includes(variant)) {
            score += 2;
            matched = true;
          }
          if ((row.title ?? "").toLowerCase().includes(variant)) {
            score += 4;
            matched = true;
          }
          if ((row.subcategory ?? "").toLowerCase().includes(variant)) {
            score += 3;
            matched = true;
          }
          if ((row.category ?? "").toLowerCase().includes(variant)) {
            score += 3;
            matched = true;
          }
        }
        if (
          !matched &&
          token.length >= 5 &&
          fuzzyTokenInTerms(token, entry.terms)
        ) {
          score += 1;
          matched = true;
        }
        if (matched) {
          matchedTokens += 1;
        }
      }

      return {
        id: row.product_id ?? row.source_url ?? row.title ?? "unknown",
        title: row.title ?? row.source_product_label ?? "Untitled product",
        category: row.category ?? "Unknown category",
        subcategory: row.subcategory ?? "Unknown type",
        material: row.material_or_fibre ?? row.composition ?? "Mixed",
        seller: row.source_seller ?? row.source_platform ?? "Unknown source",
        productSlug: inferProductSlug(row),
        source: inferSource(row),
        score,
        matchedTokens,
      } satisfies DbMatch;
    })
    .filter(
      (match) =>
        match.score >= minScore && match.matchedTokens >= requiredMatches,
    )
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);
}

export function ProductNode({ catalog, state, dispatch }: NodeProps) {
  const runRecommendation = useRecommendation();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [source, setSource] = useState<"ai" | "deterministic" | null>(null);
  const [dbBusy, setDbBusy] = useState(false);
  const [dbErr, setDbErr] = useState("");
  const [dbEntries, setDbEntries] = useState<DbEntry[]>([]);
  const product = productFor(catalog, state);

  useEffect(() => {
    let active = true;
    setDbBusy(true);
    setDbErr("");
    fetch("/data/standardised_product_database_v3_enriched.json")
      .then((response) => (response.ok ? response.json() : null))
      .then((json) => {
        if (!active) return;
        if (!Array.isArray(json)) {
          throw new Error("invalid payload");
        }
        const entries = (json as DbRow[]).map((row) => {
          const searchable = [
            row.searchable_text,
            row.search_keywords,
            row.title,
            row.category,
            row.subcategory,
            row.material_or_fibre,
            row.brands,
            row.aesthetic_tags,
            row.style_features,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();
          const terms = searchable
            .replace(/[^a-z0-9\s]/g, " ")
            .split(/\s+/)
            .filter((term) => term.length > 1);
          return { row, searchable, terms };
        });
        setDbEntries(entries);
        setDbBusy(false);
        setDbErr("");
      })
      .catch(() => {
        if (!active) return;
        setDbEntries([]);
        setDbBusy(false);
        setDbErr("Could not load product database.");
      });
    return () => {
      active = false;
    };
  }, []);

  const dbMatches = useMemo(
    () => scoreMatches(dbEntries, state.brief),
    [dbEntries, state.brief],
  );
  const dbSearched = tokenize(state.brief).length > 0;

  function applyDbMatch(match: DbMatch) {
    dispatch({ type: "setBrief", brief: match.title });
    if (match.productSlug) {
      dispatch({ type: "selectProduct", slug: match.productSlug });
    }
    if (match.source) {
      dispatch({ type: "setSource", source: match.source });
    }
  }

  async function recommend() {
    if (busy) {
      return;
    }
    setBusy(true);
    setError("");
    try {
      const result = await runRecommendation(state.brief, state.productSlug);
      dispatch({ type: "applyRecommendation", recommendation: result });
      setSource(result.source);
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Recommendation failed",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <section aria-labelledby="product-title">
      <p className="node__eyebrow">Step 01</p>
      <h2 className="node__title" id="product-title">
        What are you making?
      </h2>
      <p className="node__lede">
        Describe the brief in your own words, then pick a product. ReFleek reads
        the brief to suggest a circular material and technique — you can
        override anything.
      </p>

      <label className="field">
        <span className="field__label">Design brief</span>
        <textarea
          className="textarea"
          value={state.brief}
          placeholder={LEGACY_DEFAULT_BRIEF}
          onChange={(event) => {
            dispatch({ type: "setBrief", brief: event.target.value });
          }}
        />
      </label>

      <div className="field" aria-live="polite">
        <span className="field__label">Database matches</span>
        {dbBusy ? (
          <p className="note">Loading enriched product database…</p>
        ) : null}
        {dbErr ? <p className="error">{dbErr}</p> : null}
        {!dbBusy && !dbErr && dbMatches.length > 0 ? (
          <div className="card-list">
            {dbMatches.map((match) => (
              <button
                key={match.id}
                type="button"
                className="card card--match"
                onClick={() => {
                  applyDbMatch(match);
                }}
              >
                <strong>{match.title}</strong>
                <span>{`${match.category} · ${match.subcategory} · ${match.material}`}</span>
                <span>{`Source: ${match.seller}`}</span>
                <span>
                  {match.productSlug
                    ? `Maps to product: ${match.productSlug}`
                    : "No direct ReFleek product mapping"}
                </span>
              </button>
            ))}
          </div>
        ) : null}
        {!dbBusy && !dbErr && dbSearched && dbMatches.length === 0 ? (
          <p className="note">
            No confident matches for this brief yet. Try clearer product words
            (for example, tote, tablecloth, scarf) or fewer terms.
          </p>
        ) : null}
      </div>

      <div className="field">
        <button
          type="button"
          className="btn"
          onClick={() => {
            void recommend();
          }}
          disabled={busy}
        >
          {busy ? "Reading brief…" : "Suggest material & technique"}{" "}
          <span className="btn__diamond">◆</span>
        </button>
        {source ? (
          <p className="note" role="status">
            <span className="recommend__source">
              {source === "ai" ? "AI suggestion" : "Rules suggestion"}
            </span>{" "}
            applied to your material, technique, pattern, and layout.
          </p>
        ) : null}
        {error ? (
          <p className="error" role="alert">
            {error}
          </p>
        ) : null}
      </div>

      {CATEGORY_LABELS.map((category) => {
        const items = catalog.products.filter(
          (entry) => entry.category === category.id,
        );
        if (items.length === 0) {
          return null;
        }
        return (
          <div className="category" key={category.id}>
            <p className="field__label category__label">{category.label}</p>
            <div className="chip-row">
              {items.map((entry) => (
                <button
                  key={entry.slug}
                  type="button"
                  className="chip"
                  aria-pressed={state.productSlug === entry.slug}
                  onClick={() => {
                    dispatch({ type: "selectProduct", slug: entry.slug });
                  }}
                >
                  {entry.name}
                </button>
              ))}
            </div>
          </div>
        );
      })}

      {product && !product.fixedSize ? (
        <div className="field">
          <span className="field__label">Dimensions (cm)</span>
          <div className="chip-row">
            <input
              className="text-input"
              type="number"
              aria-label="Width in centimetres"
              value={state.productWidth}
              min={30}
              max={400}
              style={{ maxWidth: "7rem" }}
              onChange={(event) => {
                dispatch({
                  type: "setDimension",
                  field: "productWidth",
                  value: Number(event.target.value),
                });
              }}
            />
            <input
              className="text-input"
              type="number"
              aria-label="Height in centimetres"
              value={state.productHeight}
              min={30}
              max={400}
              style={{ maxWidth: "7rem" }}
              onChange={(event) => {
                dispatch({
                  type: "setDimension",
                  field: "productHeight",
                  value: Number(event.target.value),
                });
              }}
            />
          </div>
        </div>
      ) : null}

      <label className="field">
        <span className="field__label">Style direction</span>
        <select
          className="text-input"
          value={state.style}
          onChange={(event) => {
            dispatch({ type: "setStyle", style: event.target.value });
          }}
        >
          {STYLE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    </section>
  );
}
