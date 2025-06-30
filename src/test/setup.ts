import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock import.meta.env for environment variables
Object.defineProperty(import.meta, "env", {
  value: {
    VITE_API_BASE_URL: "http://localhost:5001",
    VITE_ENV: "test",
    MODE: "test",
    DEV: true,
    PROD: false,
  },
  writable: true,
});

// Global fetch mock
globalThis.fetch = vi.fn();

// Mock console methods to reduce test noise
globalThis.console = {
  ...console,
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};
