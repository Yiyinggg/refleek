import type { WorkflowState } from "./types";

const REPEAT_LABELS: Record<string, string> = {
  grid: "Grid repeat",
  "half-drop": "Half drop",
  brick: "Brick repeat",
  mirror: "Mirror repeat",
  single: "Single",
};

const PLACEMENT_LABELS: Record<string, string> = {
  corner: "Corner",
  center: "Centre",
  border: "Border",
};

/** Mirrors the backend layout label so the preview reads correctly before the
 * production query resolves. */
export function layoutLabelFor(state: WorkflowState): string {
  if (state.repeatMode === "single") {
    return `${PLACEMENT_LABELS[state.placement] ?? "Centre"} · single`;
  }
  return REPEAT_LABELS[state.repeatMode] ?? "Grid repeat";
}
