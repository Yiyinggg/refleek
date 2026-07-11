import type { Dispatch } from "react";
import type { ProductionResult } from "../convexHooks";
import type { WorkflowAction } from "../state";
import type { Catalog, WorkflowState } from "../types";

export interface NodeProps {
  catalog: Catalog;
  state: WorkflowState;
  dispatch: Dispatch<WorkflowAction>;
  production: ProductionResult | undefined;
}
