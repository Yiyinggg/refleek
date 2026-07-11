import { useMemo, useReducer } from "react";
import { FooterNav } from "./components/FooterNav";
import { LivePreview } from "./components/LivePreview";
import { Masthead } from "./components/Masthead";
import { Stepper } from "./components/Stepper";
import { TechPackPrint } from "./components/TechPackPrint";
import { LayoutNode } from "./components/nodes/LayoutNode";
import { MaterialNode } from "./components/nodes/MaterialNode";
import { PatternNode } from "./components/nodes/PatternNode";
import { ProducerNode } from "./components/nodes/ProducerNode";
import { ProductNode } from "./components/nodes/ProductNode";
import { RenderNode } from "./components/nodes/RenderNode";
import { TechPackNode } from "./components/nodes/TechPackNode";
import { TechniqueNode } from "./components/nodes/TechniqueNode";
import type { NodeProps } from "./components/nodeProps";
import { useCatalog, useProduction } from "./convexHooks";
import { createWorkflowReducer, makeInitialState } from "./state";
import type { Catalog } from "./types";

const NODES: ((props: NodeProps) => React.JSX.Element)[] = [
  ProductNode,
  MaterialNode,
  TechniqueNode,
  PatternNode,
  LayoutNode,
  RenderNode,
  TechPackNode,
  ProducerNode,
];

export function WorkflowApp() {
  const catalog = useCatalog();

  if (catalog === undefined) {
    return (
      <div className="state" role="status" aria-live="polite">
        <div className="spinner" aria-hidden="true" />
        <p className="eyebrow">Loading the material catalog…</p>
      </div>
    );
  }

  if (catalog.products.length === 0) {
    return (
      <div className="state" role="alert">
        <h1 className="node__title">No catalog</h1>
        <p>
          The material catalog is empty. Seed it with{" "}
          <code>npx convex run seed:seedCatalogData</code>, then reload.
        </p>
      </div>
    );
  }

  return <Workflow catalog={catalog} />;
}

function Workflow({ catalog }: { catalog: Catalog }) {
  const reducer = useMemo(() => createWorkflowReducer(catalog), [catalog]);
  const [state, dispatch] = useReducer(reducer, catalog, makeInitialState);
  const production = useProduction(state, true);

  const ActiveNode = NODES[state.node - 1] ?? ProductNode;
  const nodeProps: NodeProps = { catalog, state, dispatch, production };

  return (
    <div className="app">
      <Masthead dispatch={dispatch} />
      <div className="workflow">
        <main className="workflow__main">
          <Stepper node={state.node} dispatch={dispatch} />
          <ActiveNode {...nodeProps} />
          <FooterNav node={state.node} dispatch={dispatch} />
        </main>
        <LivePreview catalog={catalog} state={state} production={production} />
      </div>
      <TechPackPrint catalog={catalog} state={state} production={production} />
    </div>
  );
}
