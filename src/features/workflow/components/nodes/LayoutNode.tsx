import { type WorkflowAction } from "../../state";
import type { NodeProps } from "../nodeProps";

interface SliderSpec {
  field:
    | "layoutScale"
    | "layoutRotate"
    | "motifScale"
    | "motifRotate"
    | "motifOffsetX"
    | "motifOffsetY";
  label: string;
  min: number;
  max: number;
  unit: string;
}

const LAYOUT_SLIDERS: SliderSpec[] = [
  { field: "layoutScale", label: "Scale", min: 50, max: 200, unit: "%" },
  { field: "layoutRotate", label: "Rotate", min: -180, max: 180, unit: "°" },
];

const MOTIF_SLIDERS: SliderSpec[] = [
  { field: "motifScale", label: "Motif scale", min: 50, max: 200, unit: "%" },
  {
    field: "motifRotate",
    label: "Motif rotate",
    min: -180,
    max: 180,
    unit: "°",
  },
  { field: "motifOffsetX", label: "Offset X", min: -50, max: 50, unit: "%" },
  { field: "motifOffsetY", label: "Offset Y", min: -50, max: 50, unit: "%" },
];

export function LayoutNode({ catalog, state, dispatch }: NodeProps) {
  const repeats = catalog.layouts.filter((layout) => layout.kind === "repeat");
  const placements = catalog.layouts.filter(
    (layout) => layout.kind === "placement",
  );

  return (
    <section aria-labelledby="layout-title">
      <p className="node__eyebrow">Step 05</p>
      <h2 className="node__title" id="layout-title">
        Layout
      </h2>
      <p className="node__lede">
        Set how the motif repeats or sits on the product. Fine-tune scale,
        rotation, and offset — every change resets the render.
      </p>

      <div className="field">
        <span className="field__label">Repeat mode</span>
        <div className="chip-row">
          {repeats.map((layout) => (
            <button
              key={layout.slug}
              type="button"
              className="chip"
              aria-pressed={state.repeatMode === layout.slug}
              onClick={() => {
                dispatch({ type: "setRepeatMode", slug: layout.slug });
              }}
            >
              {layout.name}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <span className="field__label">Placement (single)</span>
        <div className="chip-row">
          {placements.map((layout) => (
            <button
              key={layout.slug}
              type="button"
              className="chip"
              aria-pressed={state.placement === layout.slug}
              onClick={() => {
                dispatch({ type: "setPlacement", slug: layout.slug });
              }}
            >
              {layout.name}
            </button>
          ))}
        </div>
      </div>

      <Sliders specs={LAYOUT_SLIDERS} state={state} dispatch={dispatch} />
      <Sliders specs={MOTIF_SLIDERS} state={state} dispatch={dispatch} />
    </section>
  );
}

function Sliders({
  specs,
  state,
  dispatch,
}: {
  specs: SliderSpec[];
  state: NodeProps["state"];
  dispatch: NodeProps["dispatch"];
}) {
  return (
    <div className="field">
      {specs.map((spec) => {
        const value = state[spec.field];
        return (
          <div className="slider" key={spec.field}>
            <div className="slider__head">
              <span>{spec.label}</span>
              <span>
                {value}
                {spec.unit}
              </span>
            </div>
            <input
              type="range"
              min={spec.min}
              max={spec.max}
              value={value}
              aria-label={spec.label}
              onInput={(event) => {
                dispatch({
                  type: "setLayoutField",
                  field: spec.field,
                  value: Number(event.currentTarget.value),
                  commit: false,
                } satisfies WorkflowAction);
              }}
              onChange={(event) => {
                dispatch({
                  type: "setLayoutField",
                  field: spec.field,
                  value: Number(event.currentTarget.value),
                } satisfies WorkflowAction);
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
