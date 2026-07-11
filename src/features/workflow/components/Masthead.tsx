import type { Dispatch } from "react";
import type { WorkflowAction } from "../state";

export function Masthead({ dispatch }: { dispatch: Dispatch<WorkflowAction> }) {
  return (
    <header className="masthead">
      <a href="/" className="masthead__brand">
        <span className="masthead__mark">ReFleek</span>
        <span className="masthead__reg" aria-hidden="true">
          ®
        </span>
      </a>
      <p className="masthead__tagline">Circular design — to — production</p>
      <div className="masthead__aside">
        <p className="masthead__issue">
          Issue Nº01
          <br />
          Deadstock edition
        </p>
        <div className="masthead__actions">
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => {
              dispatch({ type: "loadPreset", preset: "totes" });
            }}
          >
            Vintage totes
          </button>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => {
              dispatch({ type: "loadPreset", preset: "tablecloths" });
            }}
          >
            Minimal tablecloths
          </button>
        </div>
      </div>
    </header>
  );
}
