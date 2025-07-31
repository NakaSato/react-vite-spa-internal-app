import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import App from "./app/App.tsx";
import "./index.css";
import theme from "./shared/theme/muiTheme";

const container = document.getElementById("root");

if (!container) {
  throw new Error(
    "Failed to find the root element. Make sure you have a <div id='root'></div> in your index.html"
  );
}

const root = createRoot(container);

root.render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          className: "",
          duration: 4000,
          style: {
            background: "#fff",
            color: "#363636",
            fontFamily: "Sarabun, sans-serif",
            fontSize: "14px",
            fontWeight: 500,
            borderRadius: "12px",
            boxShadow:
              "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            border: "1px solid rgba(0, 0, 0, 0.05)",
            padding: "16px",
          },
          success: {
            duration: 3000,
            style: {
              background: "#f0f9ff",
              color: "#0c4a6e",
              border: "1px solid #7dd3fc",
            },
            iconTheme: {
              primary: "#0ea5e9",
              secondary: "#f0f9ff",
            },
          },
          error: {
            duration: 5000,
            style: {
              background: "#fef2f2",
              color: "#991b1b",
              border: "1px solid #fca5a5",
            },
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fef2f2",
            },
          },
          loading: {
            style: {
              background: "#fffbeb",
              color: "#92400e",
              border: "1px solid #fde68a",
            },
            iconTheme: {
              primary: "#f59e0b",
              secondary: "#fffbeb",
            },
          },
        }}
      />
    </ThemeProvider>
  </StrictMode>
);
