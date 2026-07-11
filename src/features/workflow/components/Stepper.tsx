import type { Dispatch } from "react";
import { NODE_NAMES, type WorkflowAction } from "../state";

export function Stepper({
  node,
  dispatch,
}: {
  node: number;
  dispatch: Dispatch<WorkflowAction>;
}) {
  return (
    <nav className="stepper" aria-label="Workflow steps">
      {NODE_NAMES.map((name, index) => {
        const step = index + 1;
        const current = step === node;
        return (
          <button
            key={name}
            type="button"
            className="step"
            aria-current={current ? "step" : undefined}
            onClick={() => { dispatch({ type: "goto", node: step }); }}
          >
            <span className="step__num">
              {String(step).padStart(2, "0")}
            </span>
            <span className="step__name">{name}</span>
          </button>
        );
      })}
    </nav>
  );
}
