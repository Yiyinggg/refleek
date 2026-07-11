import { buildRenderPrompt, callGenerate } from "../../generation";
import {
  currentMaterial,
  patternLabel,
  productFor,
  techniqueLabels,
} from "../../selectors";
import type { NodeProps } from "../nodeProps";

export function RenderNode({ catalog, state, dispatch }: NodeProps) {
  const material = currentMaterial(catalog, state);
  const product = productFor(catalog, state);

  async function generate() {
    if (state.renderBusy || !material || !product) {
      return;
    }
    dispatch({ type: "renderStart" });
    try {
      const image = await callGenerate({
        mode: "render",
        prompt: buildRenderPrompt(
          state,
          material,
          product,
          techniqueLabels(catalog, state),
          patternLabel(catalog, state),
        ),
        image: state.patternImg ?? undefined,
      });
      dispatch({ type: "renderSuccess", image });
    } catch (caught) {
      dispatch({
        type: "renderError",
        message: caught instanceof Error ? caught.message : "Render failed",
      });
    }
  }

  return (
    <section aria-labelledby="render-title">
      <p className="node__eyebrow">Step 06</p>
      <h2 className="node__title" id="render-title">
        Product render
      </h2>
      <p className="node__lede">
        Generate a photorealistic preview from everything you’ve chosen. Re-run
        it any time you change the design.
      </p>

      <button
        type="button"
        className="btn"
        onClick={() => {
          void generate();
        }}
        disabled={state.renderBusy}
      >
        {state.renderBusy
          ? "Rendering…"
          : state.renderImg
            ? "Re-render"
            : "Generate AI render"}{" "}
        <span className="btn__diamond">◆</span>
      </button>

      {state.renderErr ? (
        <p className="error" role="alert">
          {state.renderErr}
        </p>
      ) : null}

      {state.renderImg ? (
        <img
          src={state.renderImg}
          alt="Generated product render"
          style={{
            marginTop: "1.2rem",
            width: "min(100%, 460px)",
            border: "1.5px solid var(--ink)",
            display: "block",
          }}
        />
      ) : (
        <p className="node__lede" style={{ marginTop: "1.2rem" }}>
          No render yet. The live specification on the right stays accurate
          whether or not you generate an image.
        </p>
      )}
    </section>
  );
}
