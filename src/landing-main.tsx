import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { LandingPage } from "./features/landing/LandingPage";
import "./styles/global.css";
import "./styles/landing.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Missing #root application mount");
}

createRoot(root).render(
  <StrictMode>
    <LandingPage />
  </StrictMode>,
);
