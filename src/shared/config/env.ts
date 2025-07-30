// Environment configuration
export const env = {
  // API Configuration - uses environment variable with fallback
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5001",

  // Environment info
  NODE_ENV: import.meta.env.MODE || "development",
  IS_DEVELOPMENT: import.meta.env.DEV ?? true,
  IS_PRODUCTION: import.meta.env.PROD ?? false,

  // Custom environment
  ENVIRONMENT: import.meta.env.VITE_ENV || "development",
} as const;

// Type definitions for environment
export type Environment = typeof env;

// Validate required environment variables
const validateEnv = () => {
  // In production, allow empty API_BASE_URL for demo/static deployment
  if (env.IS_DEVELOPMENT && !env.API_BASE_URL) {
    console.warn("⚠️ No API_BASE_URL configured in development mode");
  }

  // Log the API URL being used for debugging
  if (env.IS_DEVELOPMENT) {
    console.log("🔗 API Configuration:", {
      API_BASE_URL: env.API_BASE_URL,
      source: import.meta.env.VITE_API_BASE_URL
        ? "environment variable"
        : "default fallback",
    });
  }
};

// Run validation
validateEnv();

// Export for logging/debugging
export const logEnvironment = () => {
  if (env.IS_DEVELOPMENT) {
    console.log("🌍 Environment Configuration:", {
      API_BASE_URL: env.API_BASE_URL,
      NODE_ENV: env.NODE_ENV,
      ENVIRONMENT: env.ENVIRONMENT,
    });
  }
};
