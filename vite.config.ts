import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

// Environment configuration
const isProduction = process.env.NODE_ENV === "production";
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
    host: true,
    // Enable HMR optimizations
    hmr: {
      overlay: true,
    },
  },

  build: {
    outDir: "dist",
    sourcemap: isProduction ? false : true,
    target: "esnext",
    minify: "esbuild",
    chunkSizeWarningLimit: 600,

    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          router: ["react-router-dom"],
          charts: ["chart.js", "react-chartjs-2"],
          pdf: ["@react-pdf/renderer"],
          motion: ["framer-motion"],
          utils: ["zustand", "immer"],
        },

        // Random file naming for enhanced cache busting and security
        entryFileNames: () => {
          const randomId = Math.random().toString(36).substring(2, 15);
          return `assets/${randomId}.js`;
        },

        chunkFileNames: () => {
          const randomId = Math.random().toString(36).substring(2, 15);
          return `assets/${randomId}.js`;
        },

        // Random asset naming
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split(".") ?? [];
          const ext = info[info.length - 1];
          const randomId = Math.random().toString(36).substring(2, 15);

          if (/\.(css)$/.test(assetInfo.name ?? "")) {
            return `assets/styles/${randomId}.${ext}`;
          }
          if (
            /\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name ?? "")
          ) {
            return `assets/images/${randomId}.${ext}`;
          }
          return `assets/${randomId}.${ext}`;
        },
      },
    },
  },

  // Enhanced dependency optimization
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom", "react-hot-toast"],
  },

  // Enhanced esbuild configuration
  esbuild: {
    target: "esnext",
    ...(isProduction && {
      drop: ["console", "debugger"],
    }),
  },

  // Define globals for better optimization
  define: {
    __DEV__: !isProduction,
  },
});
