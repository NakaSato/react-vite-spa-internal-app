import { describe, it, expect, vi } from "vitest";

// Mock import.meta.env
vi.mock("import.meta", () => ({
  env: {
    VITE_API_BASE_URL: "http://localhost:5001", // Updated to match API documentation
    VITE_ENV: "test",
    MODE: "test",
    DEV: true,
    PROD: false,
  },
}));

describe("Environment Configuration", () => {
  it("should have correct API base URL in test environment", async () => {
    const { env } = await import("../config/env");
    expect(env.API_BASE_URL).toBe("http://localhost:5001");
  });

  it("should identify test environment correctly", async () => {
    const { env } = await import("../config/env");
    expect(env.ENVIRONMENT).toBe("test");
    expect(env.IS_DEVELOPMENT).toBe(true);
    expect(env.IS_PRODUCTION).toBe(false);
  });

  it("should have required environment variables", async () => {
    const { env } = await import("../config/env");
    expect(env.API_BASE_URL).toBeDefined();
    expect(env.NODE_ENV).toBeDefined();
  });
});
