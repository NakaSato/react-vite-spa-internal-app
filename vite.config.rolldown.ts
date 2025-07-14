import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { createHtmlPlugin } from "vite-plugin-html";

// Configuration for different build targets
const isRolldownBuild = process.env.BUILD_TARGET === "rolldown";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    createHtmlPlugin({
      minify: true,
    }),
  ],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    target: "esnext",
    rollupOptions: {
      output: {
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
    },
    // Increase chunk size warning limit to 2MB for PDF functionality
    chunkSizeWarningLimit: 2000,
  },
  // Optimize for modern bundlers like Rolldown
  optimizeDeps: {
    esbuildOptions: {
      target: "esnext",
    },
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@emotion/react",
      "@emotion/styled",
    ],
  },
  esbuild: {
    target: "esnext",
    logOverride: { "this-is-undefined-in-esm": "silent" },
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  define: {
    // Enable production optimizations
    "process.env.NODE_ENV": JSON.stringify(
      process.env.NODE_ENV || "development"
    ),
  },
});
