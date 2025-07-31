// Bun build configuration
// Note: Bun types might not be available in this project yet
// This config provides build settings for potential Bun builds

interface BunBuildConfig {
  entrypoints: string[];
  outdir: string;
  target: string;
  format: string;
  splitting: boolean;
  sourcemap: string | boolean;
  minify: boolean;
  define: Record<string, string>;
  external?: string[];
}

const config: BunBuildConfig = {
  entrypoints: ["./src/main.tsx"],
  outdir: "./dist",
  target: "browser",
  format: "esm",
  splitting: true,
  sourcemap: "external",
  minify: process.env.NODE_ENV === "production",
  define: {
    "process.env.NODE_ENV": JSON.stringify(
      process.env.NODE_ENV || "development"
    ),
  },
  external: [
    // Let Vite handle these for now
    "react",
    "react-dom",
  ],
};

export default config;
