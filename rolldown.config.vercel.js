import { defineConfig } from "rolldown";
import { resolve } from "path";

export default defineConfig({
  input: resolve(__dirname, "src/main.tsx"),
  output: {
    dir: "dist",
    format: "es",
    entryFileNames: "[name]-[hash].js",
    chunkFileNames: "[name]-[hash].js",
    assetFileNames: "[name]-[hash][extname]",
    // Vercel-optimized chunk strategy
    manualChunks: {
      // Core React chunks
      "vendor-react": ["react", "react-dom"],
      "vendor-router": ["react-router-dom"],

      // UI libraries
      "vendor-ui": ["@emotion/react", "@emotion/styled", "react-hot-toast"],

      // PDF rendering (larger chunk)
      "vendor-pdf": ["@react-pdf/renderer"],

      // Utilities
      "vendor-utils": ["tailwindcss"],
    },
  },
  plugins: [
    // Vercel-optimized plugins would go here
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
  },
  external: [],
  treeshake: {
    moduleSideEffects: false,
    propertyReadSideEffects: false,
    tryCatchDeoptimization: false,
  },
  // Vercel-specific optimizations
  experimental: {
    strictExecutionOrder: true,
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
    "import.meta.env.PROD": JSON.stringify(true),
    "import.meta.env.DEV": JSON.stringify(false),
    "import.meta.env.VERCEL": JSON.stringify(true),
  },
  // Optimize for Vercel's CDN
  minify: true,
  // Keep bundle size reasonable for Vercel
  onwarn: (warning, warn) => {
    // Ignore certain warnings that are common in Vercel deployments
    if (warning.code === "CIRCULAR_DEPENDENCY") return;
    if (warning.code === "EVAL") return;
    warn(warning);
  },
});
