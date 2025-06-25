import { env } from "../config/env";

// API Client configuration
export class ApiClient {
  private baseURL: string;
  private defaultHeaders: HeadersInit;

  constructor() {
    this.baseURL = env.API_BASE_URL;
    this.defaultHeaders = {
      "Content-Type": "application/json",
    };
  }

  // Set authentication token
  setAuthToken(token: string): void {
    this.defaultHeaders = {
      ...this.defaultHeaders,
      Authorization: `Bearer ${token}`,
    };
  }

  // Clear authentication token
  clearAuthToken(): void {
    const { Authorization, ...headersWithoutAuth } = this.defaultHeaders as any;
    this.defaultHeaders = headersWithoutAuth;
  }

  // Generic fetch wrapper
  private async fetch<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // GET request
  async get<T>(endpoint: string, headers?: HeadersInit): Promise<T> {
    return this.fetch<T>(endpoint, { method: "GET", headers });
  }

  // POST request
  async post<T>(
    endpoint: string,
    data?: unknown,
    headers?: HeadersInit
  ): Promise<T> {
    return this.fetch<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
      headers,
    });
  }

  // PUT request
  async put<T>(
    endpoint: string,
    data?: unknown,
    headers?: HeadersInit
  ): Promise<T> {
    return this.fetch<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
      headers,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string, headers?: HeadersInit): Promise<T> {
    return this.fetch<T>(endpoint, { method: "DELETE", headers });
  }

  // PATCH request
  async patch<T>(
    endpoint: string,
    data?: unknown,
    headers?: HeadersInit
  ): Promise<T> {
    return this.fetch<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
      headers,
    });
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.get("/health");
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient();
