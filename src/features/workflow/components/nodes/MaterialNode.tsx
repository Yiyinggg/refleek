import { swatchFor } from "../../materialSwatches";
import { materialsForSource } from "../../selectors";
import type { CatalogMaterial, SourceFilter } from "../../types";
import type { NodeProps } from "../nodeProps";

const SOURCES: { id: SourceFilter; label: string }[] = [
  { id: "deadstock", label: "Deadstock" },
  { id: "reclaimed", label: "Reclaimed" },
  { id: "mix", label: "Mix both" },
];

export function MaterialNode({ catalog, state, dispatch }: NodeProps) {
  const isMix = state.source === "mix";
  const materials = materialsForSource(catalog, state);

  function isSelected(material: CatalogMaterial): boolean {
    return isMix
      ? state.materialMix.includes(material.slug)
      : state.materialSlug === material.slug;
  }

  return (
    <section aria-labelledby="material-title">
      <p className="node__eyebrow">Step 02</p>
      <h2 className="node__title" id="material-title">
        Choose the fabric
      </h2>
      <p className="node__lede">
        Every option is deadstock or reclaimed stock with real availability. Mix
        up to five fabrics for a patchwork run.
      </p>

      <div className="field">
        <span className="field__label">Source</span>
        <div className="chip-row" role="group" aria-label="Material source">
          {SOURCES.map((entry) => (
            <button
              key={entry.id}
              type="button"
              className="chip"
              aria-pressed={state.source === entry.id}
              onClick={() =>
                { dispatch({ type: "setSource", source: entry.id }); }
              }
            >
              {entry.label}
            </button>
          ))}
        </div>
      </div>

      {isMix ? (
        <div className="field">
          <span className="field__label">Patchwork layout</span>
          <div className="chip-row">
            {(["grid", "organic"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                className="chip"
                aria-pressed={state.patchworkMode === mode}
                onClick={() =>
                  { dispatch({ type: "setPatchworkMode", mode }); }
                }
              >
                {mode === "grid" ? "Square grid" : "Organic"}
              </button>
            ))}
          </div>
          {state.mixNote ? (
            <p className="note" role="status">
              {state.mixNote}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="tiles">
        {materials.map((material) => {
          const swatch = swatchFor(material.slug);
          return (
            <button
              key={material.slug}
              type="button"
              className="tile"
              aria-pressed={isSelected(material)}
              onClick={() =>
                { dispatch(
                  isMix
                    ? { type: "toggleMixMaterial", slug: material.slug }
                    : { type: "selectMaterial", slug: material.slug },
                ); }
              }
            >
              <span
                className="tile__swatch"
                style={{
                  background: swatch.background,
                  backgroundImage:
                    swatch.image === "none" ? undefined : swatch.image,
                  backgroundSize: swatch.size,
                }}
              />
              <span className="tile__body">
                <span className="tile__name">{material.name}</span>
                <span className="tile__source">{material.sourceLabel}</span>
                <span className="tile__specs">
                  <span>{material.available}</span>
                  <span>{material.width}</span>
                  <span>{material.color}</span>
                </span>
                <span className="tile__best">
                  Best for {material.bestFor.join(", ")}.
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
