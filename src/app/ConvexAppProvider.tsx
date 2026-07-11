import { ConvexProvider, ConvexReactClient } from "convex/react";
import { useEffect, type ReactNode } from "react";
import { WORKFLOW_PATH } from "../config/routes";

const convexUrl = import.meta.env.VITE_CONVEX_URL;
const convexClient = convexUrl ? new ConvexReactClient(convexUrl) : null;

function LegacyWorkflowRedirect() {
  useEffect(() => {
    window.location.replace(WORKFLOW_PATH);
  }, []);

  return (
    <main className="configuration-error" role="status" aria-live="polite">
      <h1>Opening workflow…</h1>
      <p>
        If you are not redirected,{" "}
        <a href={WORKFLOW_PATH}>open the ReFleek workflow</a>.
      </p>
    </main>
  );
}

export function ConvexAppProvider({ children }: { children: ReactNode }) {
  if (!convexClient) {
    return <LegacyWorkflowRedirect />;
  }

  return <ConvexProvider client={convexClient}>{children}</ConvexProvider>;
}
