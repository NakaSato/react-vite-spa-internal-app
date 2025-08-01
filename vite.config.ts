import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: "@emotion/react",
      // Optimize babel transforms
      babel: {
        compact: true,
      },
    }),
  ],

  publicDir: "public",

  server: {
    port: 3000,
    // Enable HMR optimizations
    hmr: {
      overlay: false,
    },
    // Enable file system caching
    fs: {
      strict: false,
    },
  },

  build: {
    target: "es2020",
    outDir: "dist",
    // Enable build optimizations
    minify: "terser",
    cssMinify: true,
    // Reduce chunk size for better caching
    chunkSizeWarningLimit: 1000,
    // Configure rollup options for random filenames and optimization
    rollupOptions: {
      output: {
        // Random ID-only filenames
        entryFileNames: "[hash].js",
        chunkFileNames: "[hash].js",
        assetFileNames: (assetInfo) => {
          const extname = assetInfo.name?.split(".").pop();
          if (extname === "css") {
            return "[hash].css";
          }
          // Organize fonts into subfolder
          if (
            extname === "woff" ||
            extname === "woff2" ||
            extname === "ttf" ||
            extname === "eot"
          ) {
            return "fonts/[hash].[ext]";
          }
          // Organize images into subfolder
          if (
            extname === "png" ||
            extname === "jpg" ||
            extname === "jpeg" ||
            extname === "svg" ||
            extname === "webp"
          ) {
            return "images/[hash].[ext]";
          }
          return "[hash].[ext]";
        },
        // Manual chunking for better optimization
        manualChunks: {
          // Vendor chunks
          react: ["react", "react-dom"],
          mui: [
            "@mui/material",
            "@mui/icons-material",
            "@emotion/react",
            "@emotion/styled",
          ],
          router: ["react-router-dom"],
          toast: ["react-hot-toast"],
          // Utility chunks
          utils: ["src/shared/utils"],
          api: ["src/shared/api"],
          hooks: ["src/shared/hooks"],
        },
      },
      // External dependencies (if needed)
      external: [],
    },
    // Terser options for better minification
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ["console.log", "console.info"],
      },
      mangle: {
        safari10: true,
      },
    },
    // Source maps for production debugging (optional)
    sourcemap: false,
    // Disable reporting compressed size for faster builds
    reportCompressedSize: false,
  },

  // Dependency optimization
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "@mui/material",
      "@mui/icons-material",
      "@emotion/react",
      "@emotion/styled",
      "react-router-dom",
      "react-hot-toast",
    ],
    // Enable dependency pre-bundling
    force: false,
  },

  // Cache configuration
  cacheDir: "node_modules/.vite",

  resolve: {
    alias: {
      "@": "/src",
      "@components": "/src/components",
      "@features": "/src/components",
      "@shared": "/src/shared",
      "@pages": "/src/pages",
      "@widgets": "/src/widgets",
      "@lib": "/src/shared/lib",
      "@utils": "/src/shared/utils",
      "@types": "/src/shared/types",
      "@api": "/src/shared/api",
      "@hooks": "/src/shared/hooks",
      "@config": "/src/config",
      "@entities": "/src/entities",
    },
  },

  // Enable esbuild for faster builds
  esbuild: {
    target: "es2020",
    // Remove unused imports
    treeShaking: true,
    // Optimize for production
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
  },
});
