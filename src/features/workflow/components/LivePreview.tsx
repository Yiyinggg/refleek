import type { ProductionResult } from "../convexHooks";
import { effectiveDims } from "../generation";
import { swatchFor } from "../materialSwatches";
import {
  activeMaterials,
  currentMaterial,
  parseQuantity,
  patternLabel,
  productFor,
  techniqueLabels,
} from "../selectors";
import { layoutLabelFor } from "../labels";
import type { Catalog, WorkflowState } from "../types";
import { PatternOverlay } from "./PatternOverlay";

function Swatch({ slug }: { slug: string }) {
  const swatch = swatchFor(slug);
  return (
    <div
      className="preview__piece"
      style={{
        background: swatch.background,
        backgroundImage: swatch.image === "none" ? undefined : swatch.image,
        backgroundSize: swatch.size,
      }}
    />
  );
}

export function LivePreview({
  catalog,
  state,
  production,
}: {
  catalog: Catalog;
  state: WorkflowState;
  production: ProductionResult | undefined;
}) {
  const product = productFor(catalog, state);
  const material = currentMaterial(catalog, state);
  const mix = activeMaterials(catalog, state);
  const isMix = state.source === "mix" && mix.length > 1;
  const quantity = parseQuantity(state.brief);

  const stage = state.renderImg ? (
    <img
      src={state.renderImg}
      alt="Generated product render"
      style={{ animation: "swap .4s ease both" }}
    />
  ) : isMix ? (
    <div
      className="preview__patch"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${String(Math.ceil(Math.sqrt(mix.length)))}, 1fr)`,
      }}
    >
      {mix.map((m) => (
        <div
          key={m.slug}
          style={{
            position: "relative",
            aspectRatio: "1 / 1",
            borderRadius:
              state.patchworkMode === "organic" ? "40% 60% 55% 45%" : 0,
            overflow: "hidden",
          }}
        >
          <Swatch slug={m.slug} />
        </div>
      ))}
    </div>
  ) : (
    <div className="preview__patch">
      {material ? <Swatch slug={material.slug} /> : null}
      <PatternOverlay state={state} />
    </div>
  );

  const cost = production
    ? `£${String(production.cost.low)}–${String(production.cost.high)}`
    : "—";
  const materialName = isMix
    ? mix.map((m) => m.name).join(" + ")
    : (material?.name ?? "—");

  return (
    <aside className="workflow__aside" aria-label="Live specification">
      <div className="preview">
        <div className="preview__stage">{stage}</div>

        <dl className="ledger">
          <Row k="Product" v={product?.name ?? "—"} />
          <Row k="Quantity" v={`${String(quantity)} pieces`} />
          <Row k="Dimensions" v={effectiveDims(state)} />
          <Row k="Material" v={materialName} />
          <Row k="Technique" v={techniqueLabels(catalog, state) || "—"} />
          <Row
            k="Pattern / Layout"
            v={`${patternLabel(catalog, state)} · ${layoutLabelFor(state)}`}
          />
          <Row k="Est. cost" v={cost} />
          <Row k="Lead time" v={production?.leadTime ?? "—"} />
        </dl>

        {production ? (
          <div className="impact">
            {production.impact.map((row) => (
              <div className="impact__cell" key={row.label}>
                <div className="impact__val">{row.value}</div>
                <div className="impact__key">{row.label}</div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </aside>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="ledger__row">
      <dt className="ledger__key">{k}</dt>
      <dd className="ledger__val">{v}</dd>
    </div>
  );
}
