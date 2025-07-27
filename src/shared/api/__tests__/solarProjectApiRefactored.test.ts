import { describe, it, expect, beforeEach, vi } from "vitest";
import { SolarProjectApi } from "../solarProjectApiRefactored";

// Mock the modules
vi.mock("./modules/authApi");
vi.mock("./modules/projectsApi");
vi.mock("./modules/dailyReportsApi");
vi.mock("./modules/utilityApi");

describe("SolarProjectApi - Modular Architecture", () => {
  let api: SolarProjectApi;

  beforeEach(() => {
    api = new SolarProjectApi();
  });

  it("should initialize all API modules", () => {
    expect(api.auth).toBeDefined();
    expect(api.projects).toBeDefined();
    expect(api.dailyReports).toBeDefined();
    expect(api.utility).toBeDefined();
  });

  it("should provide access to ApiClient", () => {
    const apiClient = api.getApiClient();
    expect(apiClient).toBeDefined();
  });

  it("should allow setting auth token", () => {
    const mockToken = "test-token";

    // This should not throw
    expect(() => {
      api.setAuthToken(mockToken);
    }).not.toThrow();
  });

  it("should allow clearing auth token", () => {
    // This should not throw
    expect(() => {
      api.clearAuthToken();
    }).not.toThrow();
  });

  it("should have correct module structure", () => {
    // Check that modules are properly typed
    expect(typeof api.auth).toBe("object");
    expect(typeof api.projects).toBe("object");
    expect(typeof api.dailyReports).toBe("object");
    expect(typeof api.utility).toBe("object");
  });
});
