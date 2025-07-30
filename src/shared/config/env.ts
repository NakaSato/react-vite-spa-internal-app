// Environment configuration
export const env = {
  // API Configuration - uses environment variable with fallback
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || "",

  // Environment info
  NODE_ENV: import.meta.env.MODE || "development",
  IS_DEVELOPMENT: import.meta.env.DEV ?? true,
  IS_PRODUCTION: import.meta.env.PROD ?? false,

  // Custom environment
  ENVIRONMENT: import.meta.env.VITE_ENV || "development",

  // Demo mode when no API is available
  IS_DEMO_MODE:
    !import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_BASE_URL === "",
} as const;

// Type definitions for environment
export type Environment = typeof env;

// Validate required environment variables
const validateEnv = () => {
  // In development, require API URL unless explicitly in demo mode
  if (env.IS_DEVELOPMENT && !env.API_BASE_URL && !env.IS_DEMO_MODE) {
    console.warn("⚠️ No API_BASE_URL configured, running in demo mode");
  }

  // Log the API URL being used for debugging
  if (env.IS_DEVELOPMENT || env.IS_DEMO_MODE) {
    console.log("🔗 API Configuration:", {
      API_BASE_URL: env.API_BASE_URL || "(Demo Mode - No API)",
      IS_DEMO_MODE: env.IS_DEMO_MODE,
      source: import.meta.env.VITE_API_BASE_URL
        ? "environment variable"
        : "demo mode fallback",
    });
  }
};

// Run validation
validateEnv();

// Export for logging/debugging
export const logEnvironment = () => {
  if (env.IS_DEVELOPMENT || env.IS_DEMO_MODE) {
    console.log("🌍 Environment Configuration:", {
      API_BASE_URL: env.API_BASE_URL || "(Demo Mode)",
      NODE_ENV: env.NODE_ENV,
      ENVIRONMENT: env.ENVIRONMENT,
      IS_DEMO_MODE: env.IS_DEMO_MODE,
    });
  }
};
