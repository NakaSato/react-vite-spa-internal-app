import { env } from "../config/env";

// API Client configuration
export class ApiClient {
  private baseURL: string;
  private defaultHeaders: HeadersInit;

  constructor() {
    this.baseURL = env.API_BASE_URL;
    this.defaultHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    console.log("API Client initialized with base URL:", this.baseURL);
  }

  // Update base URL - useful for testing or switching endpoints
  setBaseURL(url: string): void {
    this.baseURL = url;
    console.log("API base URL updated to:", url);
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

  // Generic request wrapper
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    // Merge headers properly, ensuring we don't override Content-Type if explicitly set
    const mergedHeaders = {
      ...this.defaultHeaders,
      ...options.headers,
    };

    const config: RequestInit = {
      ...options,
      headers: mergedHeaders,
    };

    // Debug logging for troubleshooting
    console.log("API Request:", {
      url,
      method: config.method || "GET",
      headers: config.headers,
      bodyType: typeof config.body,
      body: config.body,
      hasBody: !!config.body,
    });

    try {
      const response = await fetch(url, config);

      console.log("API Response:", {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      });

      if (!response.ok) {
        // Try to get the error response body for better debugging
        let errorDetails = `HTTP error! status: ${response.status}`;
        try {
          const errorBody = await response.text();
          console.log("API Error Body:", errorBody);
          if (errorBody) {
            errorDetails += ` - ${errorBody}`;
          }
        } catch (e) {
          console.log("Could not parse error response body");
        }
        throw new Error(errorDetails);
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // GET request
  async get<T>(endpoint: string, headers?: HeadersInit): Promise<T> {
    return this.request<T>(endpoint, { method: "GET", headers });
  }

  // POST request
  async post<T>(
    endpoint: string,
    data?: unknown,
    headers?: HeadersInit
  ): Promise<T> {
    const config: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };

    if (data) {
      config.body = JSON.stringify(data);
    }

    return this.request<T>(endpoint, config);
  }

  // PUT request
  async put<T>(
    endpoint: string,
    data?: unknown,
    headers?: HeadersInit
  ): Promise<T> {
    const config: RequestInit = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };

    if (data) {
      config.body = JSON.stringify(data);
    }

    return this.request<T>(endpoint, config);
  }

  // DELETE request
  async delete<T>(endpoint: string, headers?: HeadersInit): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE", headers });
  }

  // PATCH request
  async patch<T>(
    endpoint: string,
    data?: unknown,
    headers?: HeadersInit
  ): Promise<T> {
    const config: RequestInit = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };

    if (data) {
      config.body = JSON.stringify(data);
    }

    return this.request<T>(endpoint, config);
  }

  // Health check - directly use port 5001 to avoid connection issues
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    try {
      // Ensure we're using port 5001 for health check with additional URL parsing
      let healthUrl = "http://localhost:5001/health";
      console.log("Current baseURL:", this.baseURL);
      console.log("Checking API health at:", healthUrl);

      // Force disable any caching
      const options = {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
        // Add a random param to bust any cache
        cache: "no-store" as RequestCache,
      };

      const response = await fetch(healthUrl, options);

      if (!response.ok) {
        throw new Error(`Health check failed with status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Health check failed:", error);
      throw error;
    }
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient();

// Initialize with correct URL for API endpoints
if (env.API_BASE_URL !== "http://localhost:5001") {
  console.warn("API_BASE_URL mismatch - forcing correct URL for health checks");
  apiClient.setBaseURL("http://localhost:5001");
}
