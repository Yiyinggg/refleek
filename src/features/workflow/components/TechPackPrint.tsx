import type { ProductionResult } from "../convexHooks";
import { effectiveDims } from "../generation";
import { layoutLabelFor } from "../labels";
import {
  currentMaterial,
  parseQuantity,
  patternLabel,
  productFor,
  techniqueLabels,
} from "../selectors";
import type { Catalog, WorkflowState } from "../types";

/** Hidden on screen; the only thing that reaches paper via print CSS. */
export function TechPackPrint({
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
    <div className="tech-pack--print">
      <h1 style={{ fontFamily: "var(--font-display)", margin: 0 }}>
        ReFleek Tech Pack — TP001
      </h1>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
        <tbody>
          {rows.map(([key, value]) => (
            <tr key={key}>
              <th
                style={{
                  textAlign: "left",
                  padding: "6px 12px 6px 0",
                  fontFamily: "var(--font-mono)",
                  fontSize: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  verticalAlign: "top",
                }}
              >
                {key}
              </th>
              <td style={{ padding: "6px 0", borderBottom: "1px solid #ddd" }}>
                {value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {production ? (
        <>
          <h2 style={{ fontSize: "12px", marginTop: "1rem" }}>Surface rule</h2>
          <p style={{ fontSize: "12px" }}>{production.surfaceRule}</p>
          <h2 style={{ fontSize: "12px" }}>Construction notes</h2>
          <p style={{ fontSize: "12px" }}>{production.constructionNotes}</p>
          <h2 style={{ fontSize: "12px" }}>Producer</h2>
          <p style={{ fontSize: "12px" }}>
            {production.producer.name} — {production.producer.location}. MOQ{" "}
            {production.producer.minimumOrder} · Lead {production.producer.leadTime}.
          </p>
        </>
      ) : null}

      <div style={{ display: "flex", gap: "12px", marginTop: "1rem", flexWrap: "wrap" }}>
        {state.patternImg ? (
          <img src={state.patternImg} alt="Pattern artwork" style={{ width: "180px" }} />
        ) : null}
        {state.renderImg ? (
          <img src={state.renderImg} alt="Product render" style={{ width: "220px" }} />
        ) : null}
      </div>
    </div>
  );
}
