import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Bundle analyzer - enabled only when ANALYZE=true
    process.env.ANALYZE === "true" &&
      visualizer({
        filename: "dist/stats.html",
        open: true,
        gzipSize: true,
        brotliSize: true,
      }),
  ].filter(Boolean),

  server: {
    host: true,
    port: 3000,
    open: true,
  },

  build: {
    target: "esnext",
    outDir: "dist",
    sourcemap: false,
    // Increase chunk size warning limit for PDF library
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Generate random hash-based filenames for better caching
        entryFileNames: "assets/[hash].js",
        chunkFileNames: "assets/[hash].js",
        assetFileNames: (assetInfo) => {
          if (!assetInfo.name) return "assets/[hash][extname]";
          const info = assetInfo.name.split(".");
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[hash][extname]`;
          }
          if (/css/i.test(ext)) {
            return `assets/css/[hash][extname]`;
          }
          return `assets/[hash][extname]`;
        },
        manualChunks: {
          // Core React libraries
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],

          // UI and Animation libraries
          ui: ["framer-motion", "react-hot-toast"],

          // Material-UI components (new chunking for MUI)
          mui: [
            "@mui/material",
            "@mui/icons-material",
            "@mui/lab",
            "@mui/x-charts",
            "@mui/x-tree-view",
            "@mui/joy",
          ],

          // PDF and Charts (large libraries)
          pdf: ["@react-pdf/renderer"],

          // Utilities and smaller libraries
          utils: ["crypto-js"],
        },
      },
    },
  },

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
    },
  },

  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV === "development"),
  },
});
