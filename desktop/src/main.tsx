import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./desktop.css";
import { App } from "./app.tsx";

const root = document.getElementById("app");
if (!root) throw new Error("Missing #app element");
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
