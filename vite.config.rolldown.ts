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
      allow: [".."], // Allow parent directory access for better module resolution
    },
    // Enhanced warmup for faster cold starts
    warmup: {
      clientFiles: ["./src/main.tsx", "./src/app/App.tsx"],
    },
  },

  build: {
    outDir: "dist",
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
        if (
          !isProduction &&
          (id.includes("chart.js") || id.includes("@react-pdf"))
        ) {
          return false; // Include in development for easier debugging
        }
        return false;
      },

      output: {
        // Optimized chunking strategy for Rolldown best practices
        manualChunks: (id) => {
          // React ecosystem - small and fast loading
          if (
            id.includes("node_modules/react") ||
            id.includes("node_modules/react-dom")
          ) {
            return "react-core";
          }

          // Router - separate for code splitting
          if (id.includes("node_modules/react-router")) {
            return "router";
          }

          // PDF ecosystem - isolate heavy libraries for lazy loading
          if (
            id.includes("@react-pdf") ||
            id.includes("fontkit") ||
            id.includes("pdfkit") ||
            id.includes("unicode-trie") ||
            id.includes("restructure") ||
            id.includes("brotli") ||
            id.includes("pako") ||
            id.includes("events") ||
            id.includes("media-engine")
          ) {
            return "pdf-ecosystem";
          }

          // Charts - separate for performance
          if (
            id.includes("recharts") ||
            id.includes("chart.js") ||
            id.includes("react-chartjs-2") ||
            id.includes("d3-") ||
            id.includes("victory")
          ) {
            return "charts-lib";
          }

          // UI libraries - group related components
          if (
            id.includes("@headlessui") ||
            id.includes("@heroicons") ||
            id.includes("@emotion") ||
            id.includes("goober")
          ) {
            return "ui-framework";
          }

          // HTTP and auth - critical path
          if (
            id.includes("axios") ||
            id.includes("jwt-decode") ||
            id.includes("signalr") ||
            id.includes("@microsoft/signalr")
          ) {
            return "network-auth";
          }

          // Utilities - commonly used
          if (
            id.includes("node_modules") &&
            (id.includes("lodash") ||
              id.includes("moment") ||
              id.includes("date-fns") ||
              id.includes("uuid") ||
              id.includes("set-cookie-parser") ||
              id.includes("crypto-js"))
          ) {
            return "utils-lib";
          }

          // Application features - feature-based splitting
          if (id.includes("/features/auth/")) return "app-auth";
          if (id.includes("/features/projects/")) return "app-projects";
          if (id.includes("/features/reports/")) return "app-reports";
          if (id.includes("/features/dashboard/")) return "app-dashboard";

          // Shared application code
          if (id.includes("/shared/")) return "app-shared";

          // Default vendor chunk for remaining libraries
          if (id.includes("node_modules")) {
            return "vendor-libs";
          }
        },

        // Enhanced file naming for production optimization - pure random for security
        entryFileNames: () => {
          const randomId = Math.random().toString(36).substring(2, 15);
          return `js/${randomId}.js`;
        },
        chunkFileNames: () => {
          const randomId = Math.random().toString(36).substring(2, 15);
          return `js/${randomId}.js`;
        },
        assetFileNames: (assetInfo) => {
          const ext = assetInfo.name?.split(".").pop() || "unknown";
          const randomId = Math.random().toString(36).substring(2, 15);

          if (/\.(css)$/i.test(assetInfo.name ?? "")) {
            return `css/${randomId}.css`;
          }
          if (
            /\.(png|jpe?g|svg|gif|webp|avif|tiff|bmp|ico)$/i.test(
              assetInfo.name ?? ""
            )
          ) {
            return `img/${randomId}.${ext}`;
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name ?? "")) {
            return `fonts/${randomId}.${ext}`;
          }
          return `assets/${randomId}.${ext}`;
        },

        // Production optimizations
        compact: isProduction,
        generatedCode: {
          preset: "es2015",
          arrowFunctions: true,
          constBindings: true,
          objectShorthand: true,
        },

        // Enhanced HTTP/2 optimization
        experimentalMinChunkSize: 25000, // 25KB minimum for better HTTP/2 performance
      },
    },

    // Optimized chunk size limits for Rolldown
    chunkSizeWarningLimit: 1000, // Higher limit for Rolldown's efficient chunking

    // Enhanced CSS handling with best practices
    cssCodeSplit: true,
    cssMinify: isProduction ? "esbuild" : false, // Only minify in production

    // Rolldown-specific optimizations
    minify: isProduction ? "esbuild" : false, // Conditional minification
    sourcemap: isProduction ? false : "inline", // Inline sourcemaps for development

    // Enhanced asset optimization
    assetsInlineLimit: 4096, // 4KB limit for inlining assets
    reportCompressedSize: !isProduction, // Skip size reporting in production for faster builds

    // Rolldown performance optimizations
    emptyOutDir: true,
    copyPublicDir: true,

    // Ensure CSS is properly handled
    cssTarget: "esnext",
  },

  // Enhanced dependency optimization for Rolldown
  optimizeDeps: {
    esbuildOptions: {
      target: "esnext",
      treeShaking: true,
      platform: "browser",
      // Enhanced optimization for Rolldown
      keepNames: false,
      minifyIdentifiers: isProduction,
      minifySyntax: isProduction,
    },
    // Strategic pre-bundling for faster dev server
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "react-hot-toast",
      // Note: removed axios and jwt-decode as they may not be available
    ],
    // Exclude heavy libraries for better dev performance
    exclude: [
      "@react-pdf/renderer",
      "chart.js",
      "react-chartjs-2",
      "recharts", // Heavy visualization library
      "fontkit", // Large PDF dependency
    ],
    // Force rebuild when switching to Rolldown
    force: true,
  },

  // Enhanced esbuild configuration optimized for Rolldown
  esbuild: {
    target: "esnext",
    platform: "browser",
    format: "esm",
    // Enhanced production optimizations
    ...(isProduction && {
      drop: ["console", "debugger"], // Valid drop options only
      legalComments: "none",
      minifyIdentifiers: true,
      minifySyntax: true,
      minifyWhitespace: true,
      treeShaking: true,
    }),
    // Development optimizations
    ...(!isProduction && {
      keepNames: true, // Preserve function names for debugging
      sourcemap: true,
    }),
  },

  // Rolldown experimental features with best practices
  ...(isRolldownBuild && rolldownConfig),

  // Enhanced performance optimizations
  define: {
    __DEV__: JSON.stringify(!isProduction),
    __PROD__: JSON.stringify(isProduction),
    __ROLLDOWN__: JSON.stringify(isRolldownBuild),
    __BUILD_TARGET__: JSON.stringify(process.env.BUILD_TARGET || "rolldown"),
    // Runtime feature flags for better tree shaking
    __ENABLE_ANALYTICS__: JSON.stringify(true),
    __ENABLE_PDF_REPORTS__: JSON.stringify(true),
    __ENABLE_REALTIME__: JSON.stringify(true),
  },

  // Enhanced worker optimizations for Rolldown
  worker: {
    format: "es",
    plugins: () => [
      react({
        jsxRuntime: "automatic",
        // Worker-specific optimizations
      }),
    ],
    rollupOptions: {
      output: {
        format: "es",
        entryFileNames: () => {
          const randomId = Math.random().toString(36).substring(2, 15);
          return `workers/${randomId}.js`;
        },
      },
    },
  },

  // CSS preprocessing optimizations
  css: {
    devSourcemap: !isProduction,
    preprocessorOptions: {
      // Add any CSS preprocessor options here
    },
    // Use external postcss.config.js file
    postcss: undefined, // Let Vite auto-detect postcss.config.js
    // Disable CSS modules to prevent loading issues
    modules: false,
  },
});
