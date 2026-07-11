import { effectiveDims } from "../../generation";
import { layoutLabelFor } from "../../labels";
import {
  currentMaterial,
  parseQuantity,
  patternLabel,
  productFor,
  techniqueLabels,
} from "../../selectors";
import type { NodeProps } from "../nodeProps";

export function TechPackNode({ catalog, state, production }: NodeProps) {
  const product = productFor(catalog, state);
  const material = currentMaterial(catalog, state);

  const rows: [string, string][] = [
    ["Product", product?.name ?? "—"],
    ["Quantity", `${String(parseQuantity(state.brief))} pcs`],
    ["Material", material?.name ?? "—"],
    ["Source", material?.sourceLabel ?? "—"],
    ["Dimensions", effectiveDims(state)],
    ["Fabric use", production?.fabricUse ?? product?.fabricUse ?? "—"],
    ["Technique", techniqueLabels(catalog, state) || "—"],
    [
      "Pattern / Layout",
      `${patternLabel(catalog, state)} · ${layoutLabelFor(state)}`,
    ],
    [
      "Est. cost",
      production
        ? `£${String(production.cost.low)}–${String(production.cost.high)}`
        : "—",
    ],
    ["Lead time", production?.leadTime ?? "—"],
  ];

  return (
    <section aria-labelledby="techpack-title">
      <p className="node__eyebrow">Step 07</p>
      <h2 className="node__title" id="techpack-title">
        Tech pack
      </h2>
      <p className="node__lede">
        A production-ready summary. Print or save it as a PDF to send to a
        producer.
      </p>

      <button
        type="button"
        className="btn"
        onClick={() => { window.print(); }}
        style={{ marginBottom: "1.5rem" }}
      >
        Print / save PDF <span className="btn__diamond">◆</span>
      </button>

      <dl className="ledger">
        {rows.map(([key, value]) => (
          <div className="ledger__row" key={key}>
            <dt className="ledger__key">{key}</dt>
            <dd className="ledger__val">{value}</dd>
          </div>
        ))}
      </dl>

      {production ? (
        <>
          <p className="field__label" style={{ marginTop: "1.5rem" }}>
            Surface rule
          </p>
          <p className="node__lede">{production.surfaceRule}</p>
          <p className="field__label">Construction notes</p>
          <p className="node__lede">{production.constructionNotes}</p>
        </>
      ) : null}
    </section>
  );
}
