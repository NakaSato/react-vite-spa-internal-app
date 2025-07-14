import { defineConfig } from "rolldown";
import { resolve } from "path";
import {
  rolldownReactPlugin,
  rolldownCssPlugin,
  rolldownAssetsPlugin,
} from "./rolldown.plugins";

export default defineConfig({
  input: resolve(__dirname, "src/main.tsx"),
  output: {
    dir: "dist",
    format: "es",
    entryFileNames: "[name]-[hash].js",
    chunkFileNames: "[name]-[hash].js",
    assetFileNames: "[name]-[hash][extname]",
    manualChunks: (id) => {
      // Split @react-pdf/renderer into its own chunk for better caching
      if (id.includes("@react-pdf/renderer")) {
        return "pdf-renderer";
      }
      // Split React libraries
      if (id.includes("react") || id.includes("react-dom")) {
        return "vendor-react";
      }
      // Split large node_modules into vendor chunk
      if (id.includes("node_modules")) {
        return "vendor";
      }
    },
  },
  plugins: [rolldownReactPlugin(), rolldownCssPlugin(), rolldownAssetsPlugin()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
  },
  external: [],
  treeshake: true,
  // Rolldown-specific optimizations
  experimental: {
    strictExecutionOrder: true,
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify(
      process.env.NODE_ENV || "production"
    ),
    "import.meta.env.PROD": JSON.stringify(true),
    "import.meta.env.DEV": JSON.stringify(false),
  },
});
