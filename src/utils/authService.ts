import { apiClient } from "./apiClient";
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  User,
  TokenPayload,
  AUTH_ENDPOINTS,
} from "../types/auth";

export class AuthService {
  private static readonly TOKEN_KEY = "solar_auth_token";
  private static readonly REFRESH_TOKEN_KEY = "solar_refresh_token";
  private static readonly USER_KEY = "solar_user";

  // Login user
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    console.log("AuthService: Attempting login with credentials:", {
      username: credentials.username,
    });

    try {
      console.log("AuthService: Trying API login");
      const response = await apiClient.post<LoginResponse>(
        AUTH_ENDPOINTS.LOGIN,
        credentials
      );

      if (response.success && response.data) {
        // Store tokens and user data
        this.setToken(response.data.token);
        this.setRefreshToken(response.data.refreshToken);
        this.setUser(response.data.user);

        // Update API client default headers
        apiClient.setAuthToken(response.data.token);
      }

      return response;
    } catch (error) {
      console.error("AuthService: API login failed:", error);

      // Re-throw the error for proper error handling upstream
      throw error;
    }
  }

  // Register new user
  static async register(userData: RegisterRequest): Promise<RegisterResponse> {
    try {
      console.log("AuthService: Attempting API registration with data:", {
        ...userData,
        password: "[REDACTED]", // Don't log password for security
      });

      const response = await apiClient.post<RegisterResponse>(
        AUTH_ENDPOINTS.REGISTER,
        userData
      );

      // Handle both response formats from API (direct User object or nested user property)
      if (response.success && response.data) {
        // If the response data contains a direct User object (as in API docs)
        if ("userId" in response.data) {
          // Convert to expected format for consistency
          return {
            success: response.success,
            message: response.message,
            data: { user: response.data },
            errors: response.errors || [],
          };
        }
      }

      return response;
    } catch (error: any) {
      console.error("AuthService: API registration failed:", error);

      // Format error for better user experience
      if (error.message && error.message.includes("HTTP error! status: 400")) {
        // Try to extract validation errors from the response
        try {
          const errorMatch = error.message.match(
            /HTTP error! status: 400 - (.+)/
          );
          if (errorMatch && errorMatch[1]) {
            const errorData = JSON.parse(errorMatch[1]);
            const formattedError: RegisterResponse = {
              success: false,
              message: errorData.message || "Registration failed",
              data: null,
              errors: errorData.errors || ["Registration failed"],
            };
            throw formattedError;
          }
        } catch (parseError) {
          // Fallback if parsing fails
        }
      }

      // Re-throw the error for proper error handling upstream
      throw error;
    }
  }

  // Refresh authentication token
  static async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = this.getRefreshToken();

      if (!refreshToken) {
        return false;
      }

      console.log("AuthService: Attempting token refresh");
      const response = await apiClient.post<LoginResponse>(
        AUTH_ENDPOINTS.REFRESH,
        { refreshToken }
      );

      if (response.success && response.data) {
        this.setToken(response.data.token);
        this.setRefreshToken(response.data.refreshToken);
        this.setUser(response.data.user);
        apiClient.setAuthToken(response.data.token);
        return true;
      }

      return false;
    } catch (error) {
      console.error("AuthService: Token refresh failed:", error);
      this.logout();
      return false;
    }
  }

  // Logout user
  static logout(): void {
    try {
      // Call logout endpoint if token exists
      const token = this.getToken();
      if (token) {
        apiClient.post(AUTH_ENDPOINTS.LOGOUT, {}).catch(() => {
          // Ignore logout API errors
        });
      }
    } finally {
      // Always clear local storage
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
      apiClient.clearAuthToken();
    }
  }

  // Token management
  static setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static setRefreshToken(token: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  // User management
  static setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  static getUser(): User | null {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  // Token validation
  static isTokenValid(token: string): boolean {
    try {
      const payload = this.decodeToken(token);
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch {
      return false;
    }
  }

  static decodeToken(token: string): TokenPayload {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    const token = this.getToken();
    return token ? this.isTokenValid(token) : false;
  }

  // Get current user
  static getCurrentUser(): User | null {
    if (this.isAuthenticated()) {
      return this.getUser();
    }
    return null;
  }

  // Role-based access control
  static hasRole(requiredRoleId: number): boolean {
    const user = this.getCurrentUser();
    return user ? user.roleId >= requiredRoleId : false;
  }

  static hasPermission(permission: string): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;

    // Define role permissions
    const rolePermissions: Record<number, string[]> = {
      1: ["admin", "manager", "user", "viewer"], // Admin - all permissions
      2: ["manager", "user", "viewer"], // Manager
      3: ["user", "viewer"], // User
      4: ["viewer"], // Viewer
    };

    const userPermissions = rolePermissions[user.roleId] || [];
    return userPermissions.includes(permission);
  }

  // Initialize auth state on app start
  static initializeAuth(): void {
    const token = this.getToken();
    if (token && this.isTokenValid(token)) {
      apiClient.setAuthToken(token);
    } else {
      this.logout();
    }
  }
}
