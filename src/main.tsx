import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import App from "./app/App.tsx";
import "./index.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
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
    </ThemeProvider>
  </StrictMode>
);
