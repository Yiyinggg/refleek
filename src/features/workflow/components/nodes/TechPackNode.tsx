import { effectiveDims } from "../../generation";
import { layoutLabelFor } from "../../labels";
import {
  activeMaterials,
  currentMaterial,
  parseQuantity,
  patternLabel,
  productFor,
  techniqueLabels,
  usesReclaimedStream,
} from "../../selectors";
import { exportTechPackPdf } from "../../techPackPdf";
import type { NodeProps } from "../nodeProps";

export function TechPackNode({ catalog, state, production }: NodeProps) {
  const product = productFor(catalog, state);
  const material = currentMaterial(catalog, state);
  const mix = activeMaterials(catalog, state);
  const materialName =
    state.source === "mix" && mix.length > 1
      ? mix.map((entry) => entry.name).join(" + ")
      : (material?.name ?? "—");
  const reclaimed = usesReclaimedStream(catalog, state);

  async function exportPdf() {
    await exportTechPackPdf({
      rows,
      surfaceRule: production?.surfaceRule ?? "",
      constructionNotes: production?.constructionNotes ?? "",
      producerLine: production
        ? `${production.producer.name} — ${production.producer.location}. MOQ ${String(production.producer.minimumOrder)} · Lead ${production.producer.leadTime}. ${production.producer.reason}`
        : "",
      circularLabel: `${materialName} — ${reclaimed ? "reclaimed secondhand" : "new deadstock"}`,
      patternImg: state.patternImg,
      renderImg: state.renderImg,
    });
  }

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

      <div className="chip-row" style={{ marginBottom: "1.5rem" }}>
        <button
          type="button"
          className="btn"
          onClick={() => {
            void exportPdf();
          }}
        >
          Export PDF <span className="btn__diamond">◆</span>
        </button>
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => {
            window.print();
          }}
        >
          Print
        </button>
      </div>

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
