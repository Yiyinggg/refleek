import { useState } from "react";
import { useRecommendation } from "../../convexHooks";
import { productFor } from "../../selectors";
import { STYLE_OPTIONS } from "../../state";
import type { ProductCategory } from "../../types";
import type { NodeProps } from "../nodeProps";

const CATEGORY_LABELS: { id: ProductCategory; label: string }[] = [
  { id: "home-textiles", label: "Home textiles" },
  { id: "garments-accessories", label: "Garments / accessories" },
  { id: "unfinished-material", label: "Unfinished material" },
];

export function ProductNode({ catalog, state, dispatch }: NodeProps) {
  const runRecommendation = useRecommendation();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [source, setSource] = useState<"ai" | "deterministic" | null>(null);
  const product = productFor(catalog, state);

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
        the brief to suggest a circular material and technique — you can override
        anything.
      </p>

      <label className="field">
        <span className="field__label">Design brief</span>
        <textarea
          className="textarea"
          value={state.brief}
          onChange={(event) =>
            { dispatch({ type: "setBrief", brief: event.target.value }); }
          }
        />
      </label>

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
                  onClick={() =>
                    { dispatch({ type: "selectProduct", slug: entry.slug }); }
                  }
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
              onChange={(event) =>
                { dispatch({
                  type: "setDimension",
                  field: "productWidth",
                  value: Number(event.target.value),
                }); }
              }
            />
            <input
              className="text-input"
              type="number"
              aria-label="Height in centimetres"
              value={state.productHeight}
              min={30}
              max={400}
              style={{ maxWidth: "7rem" }}
              onChange={(event) =>
                { dispatch({
                  type: "setDimension",
                  field: "productHeight",
                  value: Number(event.target.value),
                }); }
              }
            />
          </div>
        </div>
      ) : null}

      <label className="field">
        <span className="field__label">Style direction</span>
        <select
          className="text-input"
          value={state.style}
          onChange={(event) =>
            { dispatch({ type: "setStyle", style: event.target.value }); }
          }
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
