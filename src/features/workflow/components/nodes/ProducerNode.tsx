import type { NodeProps } from "../nodeProps";

export function ProducerNode({ production }: NodeProps) {
  if (!production) {
    return (
      <section aria-labelledby="producer-title">
        <p className="node__eyebrow">Step 08</p>
        <h2 className="node__title" id="producer-title">
          Matching a producer
        </h2>
        <p className="node__lede">Calculating the best-fit producer…</p>
      </section>
    );
  }

  const { producer, alternateProducers } = production;

  return (
    <section aria-labelledby="producer-title">
      <p className="node__eyebrow">Step 08</p>
      <h2 className="node__title" id="producer-title">
        Your producer
      </h2>
      <p className="node__lede">
        Matched to your material stream and techniques. Two alternates are ready
        if you need a different fit.
      </p>

      <div className="producer">
        <p className="eyebrow" style={{ color: "var(--coral)" }}>
          Best match
        </p>
        <p className="producer__name">{producer.name}</p>
        <p className="tile__source" style={{ color: "rgba(244,241,234,.6)" }}>
          {producer.location}
        </p>
        <div className="producer__grid">
          <div>
            <p className="ledger__key" style={{ color: "rgba(244,241,234,.5)" }}>
              Capable of
            </p>
            <p>{producer.capabilities.join(", ")}</p>
          </div>
          <div>
            <p className="ledger__key" style={{ color: "rgba(244,241,234,.5)" }}>
              MOQ
            </p>
            <p className="producer__stat">{producer.minimumOrder}</p>
          </div>
          <div>
            <p className="ledger__key" style={{ color: "rgba(244,241,234,.5)" }}>
              Lead time
            </p>
            <p className="producer__stat">{producer.leadTime}</p>
          </div>
        </div>
        <p style={{ marginTop: "1rem", fontSize: "0.85rem", lineHeight: 1.55 }}>
          <span className="recommend__source">Why — </span>
          {producer.reason}
        </p>
      </div>

      {alternateProducers.length > 0 ? (
        <div style={{ marginTop: "1.5rem" }}>
          <p className="field__label">Alternates</p>
          {alternateProducers.map((entry) => (
            <div className="alt-producer" key={entry.slug}>
              <strong>{entry.name}</strong> — {entry.location}
              <p className="tile__best">{entry.capabilities.join(", ")}.</p>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
