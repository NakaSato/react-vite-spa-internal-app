import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { createHtmlPlugin } from "vite-plugin-html";

// Vercel-optimized Rolldown configuration
export default defineConfig({
  plugins: [
    react(),
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          title: "Solar Projects SPA - Rolldown",
          description: "Solar project management with Rolldown optimization",
        },
      },
    }),
  ],
  server: {
    port: 3000,
    host: "0.0.0.0", // Allow external connections for Vercel
  },
  build: {
    outDir: "dist",
    sourcemap: false, // Disable sourcemaps for Vercel to reduce bundle size
    target: "esnext",
    minify: "esbuild",
    rollupOptions: {
      output: {
        manualChunks: {
          // Optimize chunks for Vercel's CDN
          "vendor-react": ["react", "react-dom"],
          "vendor-router": ["react-router-dom"],
          "vendor-ui": ["@emotion/react", "@emotion/styled", "react-hot-toast"],
          "vendor-pdf": ["@react-pdf/renderer"],
        },
      },
    },
    // Vercel has a 50MB limit for serverless functions
    chunkSizeWarningLimit: 1000,
  },
  // Optimize for Vercel's edge network
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@emotion/react",
      "@emotion/styled",
    ],
    esbuildOptions: {
      target: "esnext",
    },
  },
  esbuild: {
    target: "esnext",
    drop: ["console", "debugger"], // Remove console logs in production
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
    "import.meta.env.VERCEL": JSON.stringify(true),
  },
});
