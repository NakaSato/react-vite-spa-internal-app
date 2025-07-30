import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

// Environment configuration
const isProduction = process.env.NODE_ENV === "production";
const enableAnalyzer = process.env.ANALYZE === "true";
const isDevelopment = !isProduction;

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
    // Development server configuration
    host: true,
    port: 3000,
    strictPort: false,
    // Enable CORS for API communication
    cors: true,
  },

  build: {
    // Build optimization for production
    target: "es2018",
    outDir: "dist",
    sourcemap: false, // Disable sourcemaps for production
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
        chunkFileNames: "js/[name].[hash].js",
        entryFileNames: "js/[name].[hash].js",
        assetFileNames: (assetInfo) => {
          const extType = assetInfo.name?.split(".").at(-1);
          if (extType === "css") return "css/[name].[hash][extname]";
          if (
            ["png", "jpg", "jpeg", "svg", "gif", "webp"].includes(extType || "")
          ) {
            return "images/[name].[hash][extname]";
          }
          return "assets/[name].[hash][extname]";
        },
      },
      // External dependencies (if needed)
      external: [],
    },
    // Minification settings - always enable for production builds
    minify: "esbuild",
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
      "immer",
      "d3",
      "socket.io-client",
      "buffer",
    ],
    exclude: ["@react-pdf/renderer", "tesseract.js", "fontkit"],
  },

  // Enhanced esbuild configuration for optimal performance
  esbuild: {
    target: "es2018",
    // Remove console logs and debugger in production
    ...(isProduction && {
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
