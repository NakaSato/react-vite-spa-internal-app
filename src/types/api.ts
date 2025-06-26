// API Response types
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
}

// Error response type
export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

// Example API entities (update these based on your actual API)
export interface SolarProject {
  id: string;
  name: string;
  description: string;
  capacity: number;
  location: string;
  status: "planning" | "in-progress" | "completed";
  createdAt: string;
  updatedAt: string;
}

// Health check response
export interface HealthCheckResponse {
  status: string;
  timestamp: string;
  version?: string;
}

// API endpoints (update based on your actual API)
export const API_ENDPOINTS = {
  HEALTH: "/health", // http://localhost:5001/health
  PROJECTS: "/api/v1/projects",
  PROJECT_BY_ID: (id: string) => `/api/v1/projects/${id}`,
} as const;
