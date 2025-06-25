// Environment configuration
export const env = {
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5002",

  // Environment info
  NODE_ENV: import.meta.env.MODE,
  IS_DEVELOPMENT: import.meta.env.DEV,
  IS_PRODUCTION: import.meta.env.PROD,

  // Custom environment
  ENVIRONMENT: import.meta.env.VITE_ENV || "development",
} as const;

// Type definitions for environment
export type Environment = typeof env;

// Validate required environment variables
const validateEnv = () => {
  if (!env.API_BASE_URL) {
    throw new Error("VITE_API_BASE_URL is required");
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
