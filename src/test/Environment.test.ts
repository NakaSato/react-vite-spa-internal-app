import { describe, it, expect } from "vitest";

describe("Environment Configuration", () => {
  it("should have correct API base URL in test environment", async () => {
    const { env } = await import("../shared/config/env");
    expect(env.API_BASE_URL).toBe("http://localhost:5001");
  });

  it("should identify environment correctly", async () => {
    const { env } = await import("../shared/config/env");
    expect(env.ENVIRONMENT).toBeDefined();
    expect(typeof env.IS_DEVELOPMENT).toBe("boolean");
    expect(typeof env.IS_PRODUCTION).toBe("boolean");
  });

  it("should have required environment variables", async () => {
    const { env } = await import("../shared/config/env");
    expect(env.API_BASE_URL).toBeDefined();
    expect(env.API_BASE_URL).toMatch(/^https?:\/\//); // Should be a valid URL
  });
});
