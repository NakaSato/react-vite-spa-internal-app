import { describe, it, expect, vi, beforeEach } from "vitest";
import { ApiClient } from "../utils/apiClient";

// Mock fetch
const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

describe("ApiClient", () => {
  let apiClient: ApiClient;

  beforeEach(() => {
    apiClient = new ApiClient();
    mockFetch.mockClear();
  });

  it("should make GET requests correctly", async () => {
    const mockData = { id: 1, name: "Test Project" };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    const result = await apiClient.get("/projects");

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/projects"),
      expect.objectContaining({
        method: "GET",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
      })
    );
    expect(result).toEqual(mockData);
  });

  it("should make POST requests correctly", async () => {
    const mockData = { id: 1, name: "New Project" };
    const requestData = { name: "New Project", capacity: 100 };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    const result = await apiClient.post("/projects", requestData);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/projects"),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify(requestData),
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
      })
    );
    expect(result).toEqual(mockData);
  });

  it("should handle API errors", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    await expect(apiClient.get("/nonexistent")).rejects.toThrow(
      "HTTP error! status: 404"
    );
  });

  it("should handle network errors", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    await expect(apiClient.get("/projects")).rejects.toThrow("Network error");
  });
});
