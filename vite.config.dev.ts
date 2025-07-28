import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Development-only configuration for maximum speed
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: "automatic",
    }),
  ],

  server: {
    port: 3000,
    host: true,
    // Enhanced HMR for development
    hmr: {
      overlay: true,
      port: 24678,
    },
    // Optimized file watching
    watch: {
      usePolling: false,
      interval: 100,
      ignored: ["**/node_modules/**", "**/dist/**"],
    },
    // Pre-warm critical files
    warmup: {
      clientFiles: [
        "./src/main.tsx",
        "./src/app/App.tsx",
        "./src/app/AppRoutes.tsx",
        "./src/pages/ProjectDetail.tsx",
      ],
    },
  },

  // Aggressive dependency optimization for dev
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "react-hot-toast",
      "chart.js",
      "framer-motion",
      "zustand",
      "immer",
    ],
    exclude: ["@react-pdf/renderer"], // Load on demand
    force: false,
    // Dev-specific pre-bundling
    entries: ["./src/main.tsx"],
  },

  build: {
    // Development build optimizations (when needed)
    sourcemap: true,
    minify: false,
    target: "esnext",
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000,
  },

  // Enhanced esbuild for development
  esbuild: {
    target: "esnext",
    jsx: "automatic",
    // Keep helpful debugging info
    keepNames: true,
  },

  // Development globals
  define: {
    __DEV__: true,
    __PROD__: false,
  },

  // Improved caching
  cacheDir: "node_modules/.vite-dev",
});
