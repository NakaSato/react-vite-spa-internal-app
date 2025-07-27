import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

// Environment and build target configuration
const isProduction = process.env.NODE_ENV === "production";
const buildTarget = process.env.BUILD_TARGET || "standard";
const enableAnalyzer = process.env.ANALYZE === "true";

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
    port: 3000,
    open: true,
    // Enable HMR optimizations
    hmr: {
      overlay: true,
    },
  },

  build: {
    outDir: "dist",
    sourcemap: isProduction ? "hidden" : true, // Hidden sourcemaps in production
    target: "esnext",
    minify: "esbuild",

    // Optimize chunk size limits based on modern browsers
    chunkSizeWarningLimit: 600, // Warn for chunks > 600KB

    // Enhanced rollup options for better code splitting
    rollupOptions: {
      output: {
        // Advanced manual chunking strategy
        manualChunks: (id) => {
          // React core libraries
          if (
            id.includes("node_modules/react") ||
            id.includes("node_modules/react-dom")
          ) {
            return "react-vendor";
          }

          // React Router
          if (id.includes("node_modules/react-router")) {
            return "react-router";
          }

          // PDF generation ecosystem (large libraries)
          if (
            id.includes("@react-pdf") ||
            id.includes("fontkit") ||
            id.includes("pdfkit") ||
            id.includes("unicode-trie") ||
            id.includes("restructure") ||
            id.includes("brotli")
          ) {
            return "pdf-libs";
          }

          // Charts and visualization
          if (
            id.includes("recharts") ||
            id.includes("chart.js") ||
            id.includes("react-chartjs-2")
          ) {
            return "charts";
          }

          // UI libraries
          if (
            id.includes("@headlessui") ||
            id.includes("@heroicons") ||
            id.includes("tailwindcss")
          ) {
            return "ui-libs";
          }

          // Authentication and HTTP
          if (id.includes("axios") || id.includes("jwt-decode")) {
            return "auth-http";
          }

          // Emotion and styling
          if (id.includes("@emotion") || id.includes("goober")) {
            return "styling";
          }

          // Large vendor libraries
          if (
            id.includes("node_modules") &&
            (id.includes("lodash") ||
              id.includes("moment") ||
              id.includes("date-fns"))
          ) {
            return "utilities";
          }

          // Default vendor chunk for other node_modules
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },

        // Random file naming for enhanced cache busting and security
        entryFileNames: (chunkInfo) => {
          const name = chunkInfo.name || "entry";
          const randomId = Math.random().toString(36).substring(2, 15);
          return `assets/${name}-${randomId}.js`;
        },
        chunkFileNames: (chunkInfo) => {
          // Use random naming instead of content hash
          const chunkName = chunkInfo.name || "chunk";
          const facadeModuleId = chunkInfo.facadeModuleId;
          const randomId = Math.random().toString(36).substring(2, 15);

          if (facadeModuleId) {
            // Extract meaningful file name from path
            const fileName =
              facadeModuleId
                .split("/")
                .pop()
                ?.replace(/\.(tsx?|jsx?)$/, "") || "unknown";
            return `assets/${chunkName}-${fileName}-${randomId}.js`;
          }

          return `assets/${chunkName}-${randomId}.js`;
        },

        // Random asset naming with preserved file names
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split(".") ?? [];
          const ext = info[info.length - 1];
          const baseName = assetInfo.name?.replace(/\.[^/.]+$/, "") || "asset";
          const randomId = Math.random().toString(36).substring(2, 15);

          if (/\.(css)$/.test(assetInfo.name ?? "")) {
            return `assets/styles/${baseName}-${randomId}.${ext}`;
          }
          if (
            /\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name ?? "")
          ) {
            return `assets/images/${baseName}-${randomId}.${ext}`;
          }
          return `assets/${baseName}-${randomId}.${ext}`;
        },
      },

      // Tree shaking optimizations
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false,
      },
    },

    // CSS optimization
    cssCodeSplit: true,
    cssMinify: "esbuild",
  },

  // Enhanced dependency optimization
  optimizeDeps: {
    esbuildOptions: {
      target: "esnext",
      // Enable tree shaking at dependency level
      treeShaking: true,
    },
    include: [
      // Pre-bundle commonly used dependencies
      "react",
      "react-dom",
      "react-router-dom",
      "react-hot-toast",
    ],
    exclude: [
      // Exclude large dependencies from pre-bundling
      "@react-pdf/renderer",
    ],
  },

  // Enhanced esbuild configuration
  esbuild: {
    target: "esnext",
    // Production optimizations
    ...(isProduction && {
      drop: ["console", "debugger"],
      legalComments: "none",
    }),
  },

  // Performance and caching optimizations
  experimental: {
    renderBuiltUrl(filename) {
      // Custom URL handling for assets
      return filename;
    },
  },

  // Define globals for better optimization
  define: {
    // Enable production optimizations
    __DEV__: !isProduction,
    __BUILD_TARGET__: JSON.stringify(buildTarget),
  },
});
