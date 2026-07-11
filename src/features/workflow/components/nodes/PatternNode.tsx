import { buildPatternPrompt, callGenerate } from "../../generation";
import { currentMaterial, productFor } from "../../selectors";
import type { PatternInputMode } from "../../types";
import type { NodeProps } from "../nodeProps";

const TABS: { id: PatternInputMode; label: string }[] = [
  { id: "preset", label: "Preset tiles" },
  { id: "prompt", label: "Text prompt" },
  { id: "upload", label: "Upload image" },
];

export function PatternNode({ catalog, state, dispatch }: NodeProps) {
  const material = currentMaterial(catalog, state);
  const product = productFor(catalog, state);

  async function generate() {
    if (state.patternBusy || !material || !product) {
      return;
    }
    if (state.patternInputMode === "prompt" && !state.patternPromptText.trim()) {
      dispatch({ type: "patternError", message: "Enter a text prompt describing your pattern." });
      return;
    }
    if (state.patternInputMode === "upload" && !state.patternUploadImg) {
      dispatch({ type: "patternError", message: "Upload a reference image first." });
      return;
    }
    dispatch({ type: "patternStart" });
    try {
      const image = await callGenerate({
        mode: "pattern",
        prompt: buildPatternPrompt(state, material, product),
        image:
          state.patternInputMode === "upload" && state.patternUploadImg
            ? state.patternUploadImg
            : undefined,
      });
      dispatch({ type: "patternSuccess", image });
    } catch (caught) {
      dispatch({
        type: "patternError",
        message: caught instanceof Error ? caught.message : "Generation failed",
      });
    }
  }

  function onUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        dispatch({ type: "setPatternUpload", image: reader.result });
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <section aria-labelledby="pattern-title">
      <p className="node__eyebrow">Step 04</p>
      <h2 className="node__title" id="pattern-title">
        Surface pattern
      </h2>
      <p className="node__lede">
        Pick a preset motif, or generate production-ready artwork from a prompt
        or a reference image. The finish adapts to your fabric’s surface rules.
      </p>

      <div className="tiles">
        {catalog.patterns.map((pattern) => (
          <button
            key={pattern.slug}
            type="button"
            className="tile"
            aria-pressed={state.pattern === pattern.slug}
            onClick={() => { dispatch({ type: "setPattern", slug: pattern.slug }); }}
          >
            <span className="tile__body">
              <span className="tile__name">{pattern.name}</span>
              <span className="tile__best">{pattern.note}</span>
            </span>
          </button>
        ))}
      </div>

      <div className="field" style={{ marginTop: "1.5rem" }}>
        <span className="field__label">Generate artwork</span>
        <div className="tabs" role="tablist" aria-label="Pattern input">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              className="tab"
              aria-selected={state.patternInputMode === tab.id}
              onClick={() =>
                { dispatch({ type: "setPatternInputMode", mode: tab.id }); }
              }
            >
              {tab.label}
            </button>
          ))}
        </div>

        {state.patternInputMode === "prompt" ? (
          <textarea
            className="textarea"
            placeholder="e.g. hand-drawn botanical sprigs, sparse, two-tone"
            value={state.patternPromptText}
            onChange={(event) =>
              { dispatch({ type: "setPatternPrompt", text: event.target.value }); }
            }
          />
        ) : null}

        {state.patternInputMode === "upload" ? (
          <input
            type="file"
            accept="image/*"
            aria-label="Reference image"
            onChange={onUpload}
          />
        ) : null}

        <div style={{ marginTop: "0.9rem" }}>
          <button
            type="button"
            className="btn"
            onClick={() => {
              void generate();
            }}
            disabled={state.patternBusy}
          >
            {state.patternBusy ? "Generating…" : "Generate pattern"}{" "}
            <span className="btn__diamond">◆</span>
          </button>
        </div>

        {state.patternErr ? (
          <p className="error" role="alert">
            {state.patternErr}
          </p>
        ) : null}

        {state.patternImg ? (
          <img
            src={state.patternImg}
            alt="Generated pattern artwork"
            style={{
              marginTop: "1rem",
              width: "min(100%, 320px)",
              border: "1.5px solid var(--ink)",
              display: "block",
            }}
          />
        ) : null}
      </div>
    </section>
  );
}
