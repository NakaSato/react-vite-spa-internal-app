import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App";
import "./index.css";

const container = document.getElementById("root");

if (!container) {
  throw new Error(
    "Failed to find the root element. Make sure you have a <div id='root'></div> in your index.html"
  );
}

const root = createRoot(container);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
