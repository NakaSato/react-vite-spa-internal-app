import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { createHtmlPlugin } from "vite-plugin-html";
import { visualizer } from "rollup-plugin-visualizer";

// Configuration for different build targets
const isRolldownBuild = process.env.BUILD_TARGET !== "vite"; // Default to Rolldown
const isProduction = process.env.NODE_ENV === "production";
const enableAnalyzer = process.env.ANALYZE === "true";

// Enhanced Rolldown-specific optimizations following best practices
const rolldownConfig = {
  // Rolldown uses Rust-based bundling for superior performance
  experimental: {
    renderBuiltUrl: (filename: string) => filename,
    // Enable advanced Rolldown features
    skipSsrTransform: true,
    optimizeClearScreen: true,
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: "automatic",
    }),

    createHtmlPlugin({
      minify: isProduction,
      inject: {
        data: {
          title: "Solar Projects SPA",
          description: "Modern solar project management application",
        },
      },
    }),

    // Bundle analyzer for builds
    enableAnalyzer &&
      visualizer({
        filename: "dist/rolldown-bundle-analysis.html",
        open: false,
        gzipSize: true,
        brotliSize: true,
        template: "treemap",
        // Enhanced analysis for Rolldown
        projectRoot: process.cwd(),
        sourcemap: !isProduction,
      }),
  ].filter(Boolean),

  server: {
    port: 3000,
    open: true,
    // Enhanced HMR for Rolldown with best practices
    hmr: {
      overlay: true,
      clientPort: 3000,
      port: 24678, // Use consistent HMR port
    },
    // Optimized development server for Rolldown
    fs: {
      strict: false,
      allow: ['..'], // Allow parent directory access for better module resolution
    },
    // Enhanced warmup for faster cold starts
    warmup: {
      clientFiles: ['./src/main.tsx', './src/app/App.tsx'],
    },
  },

  build: {
    outDir: "dist",
    sourcemap: isProduction ? false : true, // No sourcemaps in Rolldown production builds
    target: "esnext",

    // Rolldown-optimized settings with best practices
    rollupOptions: {
      // Enhanced tree shaking for maximum optimization
      treeshake: {
        preset: "recommended", // Use recommended instead of safest for better performance
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false,
        unknownGlobalSideEffects: false,
        // Rolldown-specific optimizations
        annotations: true,
        correctVarValueBeforeDeclaration: true,
      },

      // Enhanced external dependencies handling
      external: (id) => {
        // Keep large libraries external in development for faster rebuilds
        if (!isProduction && (id.includes('chart.js') || id.includes('@react-pdf'))) {
          return false; // Include in development for easier debugging
        }
        return false;
      },

      output: {
        // Advanced chunking strategy optimized for Rolldown
        manualChunks: (id) => {
          // React core libraries - keep small and separate
          if (
            id.includes("node_modules/react") ||
            id.includes("node_modules/react-dom")
          ) {
            return "react-core";
          }

          // React Router - separate for routing
          if (id.includes("node_modules/react-router")) {
            return "router";
          }

          // PDF generation ecosystem - major contributor to bundle size
          if (
            id.includes("@react-pdf") ||
            id.includes("fontkit") ||
            id.includes("pdfkit") ||
            id.includes("unicode-trie") ||
            id.includes("restructure") ||
            id.includes("brotli") ||
            id.includes("pako") ||
            id.includes("events")
          ) {
            return "pdf-ecosystem";
          }

          // Charts and data visualization
          if (
            id.includes("recharts") ||
            id.includes("chart.js") ||
            id.includes("react-chartjs-2") ||
            id.includes("d3-") ||
            id.includes("victory")
          ) {
            return "charts";
          }

          // UI component libraries
          if (
            id.includes("@headlessui") ||
            id.includes("@heroicons") ||
            id.includes("tailwindcss") ||
            id.includes("@emotion") ||
            id.includes("goober")
          ) {
            return "ui-components";
          }

          // Authentication, HTTP, and API
          if (
            id.includes("axios") ||
            id.includes("jwt-decode") ||
            id.includes("signalr")
          ) {
            return "api-auth";
          }

          // Utility libraries
          if (
            id.includes("node_modules") &&
            (id.includes("lodash") ||
              id.includes("moment") ||
              id.includes("date-fns") ||
              id.includes("uuid") ||
              id.includes("set-cookie-parser"))
          ) {
            return "utilities";
          }

          // Feature-based chunks for application code
          if (id.includes("/features/auth/")) return "auth-feature";
          if (id.includes("/features/projects/")) return "projects-feature";
          if (id.includes("/features/reports/")) return "reports-feature";
          if (id.includes("/features/dashboard/")) return "dashboard-feature";

          // Default vendor chunk for remaining node_modules
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },

        // Random naming with file names for security and cache busting
        entryFileNames: (chunkInfo) => {
          const name = chunkInfo.name || "entry";
          const randomId = Math.random().toString(36).substring(2, 15);
          return `assets/${name}-${randomId}.js`;
        },
        chunkFileNames: (chunkInfo) => {
          // Use random IDs instead of content hashes for security
          const name = chunkInfo.name || "chunk";
          const facadeModuleId = chunkInfo.facadeModuleId;
          const randomId = Math.random().toString(36).substring(2, 15);

          if (facadeModuleId) {
            // Extract meaningful file name from path
            const fileName =
              facadeModuleId
                .split("/")
                .pop()
                ?.replace(/\.(tsx?|jsx?)$/, "") || "unknown";
            return `assets/${name}-${fileName}-${randomId}.js`;
          }

          return `assets/${name}-${randomId}.js`;
        },
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

        // Optimize for HTTP/2
        experimentalMinChunkSize: 20000, // 20KB minimum chunk size
      },
    },

    // Rolldown-specific chunk size limits
    chunkSizeWarningLimit: 800, // Higher limit for Rolldown efficiency

    // Enhanced CSS handling
    cssCodeSplit: true,
    cssMinify: "esbuild",

    // Rolldown build optimizations
    ...(isRolldownBuild && {
      minify: "esbuild", // Use esbuild for faster minification
      sourcemap: false, // Disable sourcemaps for Rolldown production
    }),
  },

  // Rolldown-optimized dependency handling
  optimizeDeps: {
    esbuildOptions: {
      target: "esnext",
      treeShaking: true,
      platform: "browser",
    },
    include: ["react", "react-dom", "react-router-dom", "react-hot-toast"],
    exclude: ["@react-pdf/renderer", "chart.js", "react-chartjs-2"],
    // Force include for better performance
    force: isRolldownBuild,
  },

  // Enhanced esbuild configuration for Rolldown
  esbuild: {
    target: "esnext",
    platform: "browser",
    format: "esm",
    // Production optimizations
    ...(isProduction && {
      drop: ["console", "debugger"],
      legalComments: "none",
      minifyIdentifiers: true,
      minifySyntax: true,
      minifyWhitespace: true,
    }),
  },

  // Rolldown experimental features
  ...(isRolldownBuild && rolldownConfig),

  // Performance optimizations
  define: {
    __DEV__: !isProduction,
    __ROLLDOWN__: isRolldownBuild,
    __BUILD_TARGET__: JSON.stringify(process.env.BUILD_TARGET || "rolldown"),
  },

  // Worker optimizations for Rolldown
  worker: {
    format: "es",
    plugins: () => [react()],
  },
});
