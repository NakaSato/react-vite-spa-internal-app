import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Minimal working config for MUI
export default defineConfig({
  plugins: [react()],

  server: {
    host: true,
    port: 3000,
    open: true,
  },

  build: {
    target: "esnext",
    outDir: "dist",
    sourcemap: false,
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
          mui: [
            "@mui/material",
            "@mui/icons-material",
            "@emotion/react",
            "@emotion/styled",
          ],
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
});
