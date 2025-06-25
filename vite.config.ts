import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createHtmlPlugin } from 'vite-plugin-html';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    createHtmlPlugin({
      minify: true,
    }),
  ],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Split @react-pdf/renderer into its own chunk for better caching
          if (id.includes('@react-pdf/renderer')) {
            return 'pdf-renderer';
          }
          // Split React libraries
          if (id.includes('react') || id.includes('react-dom')) {
            return 'vendor-react';
          }
          // Split large node_modules into vendor chunk
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
    // Increase chunk size warning limit to 2MB for PDF functionality
    chunkSizeWarningLimit: 2000,
  },
});
