import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app/App";
import { ConvexAppProvider } from "./app/ConvexAppProvider";
import "./styles/global.css";
import "./styles/workflow.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Missing #root application mount");
}

createRoot(root).render(
  <StrictMode>
    <ConvexAppProvider>
      <App />
    </ConvexAppProvider>
  </StrictMode>,
);
