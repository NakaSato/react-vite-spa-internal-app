import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { logEnvironment } from "./config/env";
import { AuthProvider } from "./contexts/AuthContext";

// Log environment configuration in development
logEnvironment();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
