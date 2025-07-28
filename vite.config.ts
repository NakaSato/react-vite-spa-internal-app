import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

// Environment configuration
const isProduction = process.env.NODE_ENV === "production";
const enableAnalyzer = process.env.ANALYZE === "true";
const isDevelopment = !isProduction;
const buildTarget = process.env.BUILD_TARGET || "development";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Optimize JSX for production
      jsxRuntime: "automatic",
    }),

    // Bundle analyzer - enabled only when ANALYZE=true
    enableAnalyzer &&
      visualizer({
        filename: "dist/bundle-analysis.html",
        open: false,
        gzipSize: true,
        brotliSize: true,
        template: "treemap", // Use treemap for better visualization
      }),
  ].filter(Boolean),

  server: {
    // Enhanced development server configuration
    host: isDevelopment ? "localhost" : "0.0.0.0",
    port: 3000,
    strictPort: false,
    // Improved HMR for better development experience
    hmr: {
      port: 3001,
      overlay: true,
    },
    // Enable CORS for API communication
    cors: true,
    // Pre-transform known dependencies for faster cold starts
    preTransformRequests: true,
    // Optimize file watching for large projects
    watch: {
      usePolling: false,
      interval: 100,
      binaryInterval: 300,
      ignored: ["**/node_modules/**", "**/.git/**", "**/dist/**"],
    },
  },

  build: {
    // Build optimization based on target environment
    target: buildTarget === "production" ? "es2018" : "esnext",
    outDir: "dist",
    sourcemap: buildTarget === "development",
    emptyOutDir: true,
    // Smart chunking strategy
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunk for node_modules
          if (id.includes("node_modules")) {
            // Separate React ecosystem
            if (id.includes("react") || id.includes("react-dom")) {
              return "react-vendor";
            }
            // Separate chart libraries
            if (
              id.includes("chart") ||
              id.includes("d3") ||
              id.includes("vis")
            ) {
              return "chart-vendor";
            }
            // Other vendor libraries
            return "vendor";
          }
          // Feature-based chunking for your app
          if (id.includes("/features/")) {
            const feature = id.split("/features/")[1]?.split("/")[0];
            return `feature-${feature}`;
          }
        },
        // Optimize asset naming - hash only for cleaner output
        chunkFileNames: () => {
          return `js/[hash].js`;
        },
        entryFileNames: "js/[hash].js",
        assetFileNames: (assetInfo) => {
          const extType = assetInfo.name?.split(".").at(-1);
          if (extType === "css") return "css/[hash][extname]";
          if (
            ["png", "jpg", "jpeg", "svg", "gif", "webp"].includes(extType || "")
          ) {
            return "images/[hash][extname]";
          }
          return "assets/[hash][extname]";
        },
      },
      // External dependencies (if needed)
      external: [],
    },
    // Minification settings
    minify: buildTarget === "production" ? "esbuild" : false,
    // Build performance optimizations
    chunkSizeWarningLimit: 1000,
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Improve build performance
    reportCompressedSize: false,
  },

  // Enhanced dependency optimization for faster dev startup
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "react-hot-toast",
      "chart.js",
      "framer-motion",
      "zustand",
      // Chart.js components for better performance
      "chart.js/auto",
      "react-chartjs-2",
      // Other installed dependencies
      "immer",
      "d3",
      "socket.io-client",
      // Node.js polyfills for PDF libraries
      "buffer",
    ],
    exclude: [
      "@react-pdf/renderer", // Large dependency, load on demand
      "@rollup/rollup-darwin-arm64", // Native binary
      "tesseract.js", // Large WASM dependency
      "fontkit", // PDF font library with Node.js dependencies
    ],
    // Force rebuild only when dependencies change
    force: isDevelopment && process.env.FORCE_OPTIMIZE === "true",
    // Enable esbuild dependency scanning for faster discovery
    esbuildOptions: {
      target: "esnext",
      mainFields: ["module", "main"],
      conditions: ["module", "import"],
    },
  },

  // Enhanced esbuild configuration for optimal performance
  esbuild: {
    target: buildTarget === "production" ? "es2018" : "esnext",
    // Remove console logs and debugger in production
    ...(buildTarget === "production" && {
      drop: ["console", "debugger"],
      legalComments: "none", // Remove license comments to reduce bundle size
    }),
    // Faster JSX transform
    jsx: "automatic",
    // Enable top-level await for modern environments
    supported: {
      "top-level-await": true,
    },
  },

  // Resolve configuration
  resolve: {
    alias: {
      "@": "/src",
      "@components": "/src/components",
      "@features": "/src/features",
      "@shared": "/src/shared",
      "@pages": "/src/pages",
      "@widgets": "/src/widgets",
      "@lib": "/src/shared/lib",
      "@utils": "/src/shared/utils",
      "@types": "/src/shared/types",
      "@api": "/src/shared/api",
      "@hooks": "/src/shared/hooks",
      // Node.js polyfills for PDF libraries
      buffer: "buffer",
    },
    // Improve module resolution performance
    mainFields: ["module", "jsnext:main", "jsnext"],
    conditions: ["import", "module", "browser", "default"],
  },

  // Define globals for better optimization and PDF library compatibility
  define: {
    __DEV__: isDevelopment,
    __PROD__: isProduction,
    // Provide global object for PDF libraries
    global: "globalThis",
  },

  // Environment variables configuration
  envPrefix: ["VITE_", "REACT_APP_"],

  // Cache configuration for better performance
  cacheDir: "node_modules/.vite",
});
