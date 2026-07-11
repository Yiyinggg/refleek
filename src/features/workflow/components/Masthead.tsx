import type { Dispatch } from "react";
import type { WorkflowAction } from "../state";

export function Masthead({
  dispatch,
}: {
  dispatch: Dispatch<WorkflowAction>;
}) {
  return (
    <header className="masthead">
      <div>
        <h1 className="masthead__mark">
          Re<span>Fleek</span>
        </h1>
        <p className="masthead__tagline">
          Circular design to production. Turn deadstock and reclaimed fabric
          into a ready-to-make tech pack.
        </p>
      </div>
      <div className="masthead__actions">
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => { dispatch({ type: "loadPreset", preset: "totes" }); }}
        >
          Vintage totes
        </button>
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() =>
            { dispatch({ type: "loadPreset", preset: "tablecloths" }); }
          }
        >
          Minimal tablecloths
        </button>
      </div>
    </header>
  );
}
