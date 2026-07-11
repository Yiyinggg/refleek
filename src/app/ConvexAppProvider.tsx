import { ConvexProvider, ConvexReactClient } from "convex/react";
import type { ReactNode } from "react";

const convexUrl = import.meta.env.VITE_CONVEX_URL;
const convexClient = convexUrl ? new ConvexReactClient(convexUrl) : null;

export function ConvexAppProvider({ children }: { children: ReactNode }) {
  if (!convexClient) {
    return (
      <main className="configuration-error" role="alert">
        <h1>ReFleek needs configuration</h1>
        <p>
          Copy <code>.env.example</code> to <code>.env.local</code> and set{" "}
          <code>VITE_CONVEX_URL</code>.
        </p>
      </main>
    );
  }

  return <ConvexProvider client={convexClient}>{children}</ConvexProvider>;
}
