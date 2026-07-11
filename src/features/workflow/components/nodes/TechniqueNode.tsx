import { PRINT_BLOCK_REASON } from "../../state";
import { usesReclaimedStream } from "../../selectors";
import type { NodeProps } from "../nodeProps";

export function TechniqueNode({
  catalog,
  state,
  dispatch,
  production,
}: NodeProps) {
  const reclaimed = usesReclaimedStream(catalog, state);

  return (
    <section aria-labelledby="technique-title">
      <p className="node__eyebrow">Step 03</p>
      <h2 className="node__title" id="technique-title">
        Construction &amp; finish
      </h2>
      <p className="node__lede">
        Combine construction and surface techniques. Digital print is locked on
        reclaimed fabric — the panels carry washes that a print can’t sit on
        cleanly.
      </p>

      {production ? (
        <p className="note">{production.surfaceRule}</p>
      ) : null}

      <div className="chip-row" role="group" aria-label="Techniques">
        {catalog.techniques.map((technique) => {
          const locked =
            reclaimed && !technique.allowedStreams.includes("reclaimed");
          const on = state.techniques.includes(technique.slug);
          return (
            <button
              key={technique.slug}
              type="button"
              className="chip"
              aria-pressed={on}
              aria-disabled={locked}
              style={locked ? { opacity: 0.45 } : undefined}
              onClick={() =>
                { dispatch(
                  locked
                    ? { type: "showTechNote", note: PRINT_BLOCK_REASON }
                    : { type: "toggleTechnique", slug: technique.slug },
                ); }
              }
            >
              {technique.name}
              <span className="chip__meta">{technique.kind}</span>
            </button>
          );
        })}
      </div>

      {state.techNote ? (
        <p className="error" role="alert">
          {state.techNote}
        </p>
      ) : null}
    </section>
  );
}
