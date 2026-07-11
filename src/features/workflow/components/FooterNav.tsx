import type { Dispatch } from "react";
import type { WorkflowAction } from "../state";

function nextLabel(node: number): string {
  if (node === 8) {
    return "Restart";
  }
  if (node === 7) {
    return "Match producer";
  }
  return "Next";
}

export function FooterNav({
  node,
  dispatch,
}: {
  node: number;
  dispatch: Dispatch<WorkflowAction>;
}) {
  return (
    <div className="footer-nav">
      <button
        type="button"
        className="btn btn--ghost"
        onClick={() => { dispatch({ type: "back" }); }}
        disabled={node === 1}
      >
        Back
      </button>
      <button
        type="button"
        className="btn"
        onClick={() =>
          { dispatch(node === 8 ? { type: "restart" } : { type: "next" }); }
        }
      >
        {nextLabel(node)} <span className="btn__diamond">◆</span>
      </button>
    </div>
  );
}
