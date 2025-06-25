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

  // Static test accounts for demo purposes
  private static readonly STATIC_ACCOUNTS = [
    {
      username: "test_admin",
      password: "Admin123!",
      user: {
        userId: "1",
        username: "test_admin",
        email: "admin@internal.construction",
        fullName: "System Administrator",
        roleName: "Admin",
        roleId: 1,
        isActive: true,
      },
    },
    {
      username: "test_manager",
      password: "Manager123!",
      user: {
        userId: "2",
        username: "test_manager",
        email: "manager@internal.construction",
        fullName: "Project Manager",
        roleName: "Manager",
        roleId: 2,
        isActive: true,
      },
    },
    {
      username: "test_user",
      password: "User123!",
      user: {
        userId: "3",
        username: "test_user",
        email: "user@internal.construction",
        fullName: "Construction User",
        roleName: "User",
        roleId: 3,
        isActive: true,
      },
    },
    {
      username: "test_viewer",
      password: "Viewer123!",
      user: {
        userId: "4",
        username: "test_viewer",
        email: "viewer@internal.construction",
        fullName: "Project Viewer",
        roleName: "Viewer",
        roleId: 4,
        isActive: true,
      },
    },
  ];

  // Generate a mock JWT token
  private static generateMockToken(user: User): string {
    const header = { alg: "HS256", typ: "JWT" };
    const payload = {
      sub: user.userId,
      username: user.username,
      email: user.email,
      roleId: user.roleId,
      roleName: user.roleName,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
    };

    // Simple base64 encoding (not secure, just for demo)
    const encodedHeader = btoa(JSON.stringify(header));
    const encodedPayload = btoa(JSON.stringify(payload));
    const signature = btoa(`mock_signature_${user.userId}`);

    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }

  // Static login function
  private static staticLogin(credentials: LoginRequest): LoginResponse {
    const account = this.STATIC_ACCOUNTS.find(
      (acc) =>
        acc.username === credentials.username &&
        acc.password === credentials.password
    );

    if (!account) {
      return {
        success: false,
        message: "Invalid credentials",
        data: null,
        errors: ["Invalid username or password"],
      };
    }

    const token = this.generateMockToken(account.user);
    const refreshToken = this.generateMockToken(account.user); // Same for demo

    return {
      success: true,
      message: "Login successful",
      data: {
        token,
        refreshToken,
        user: account.user,
      },
      errors: [],
    };
  }

  // Login user
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      // First try static login
      const staticResponse = this.staticLogin(credentials);
      if (staticResponse.success) {
        // Store tokens and user data
        if (staticResponse.data) {
          this.setToken(staticResponse.data.token);
          this.setRefreshToken(staticResponse.data.refreshToken);
          this.setUser(staticResponse.data.user);

          // Update API client default headers
          apiClient.setAuthToken(staticResponse.data.token);
        }
        return staticResponse;
      }

      // If static login fails, try API login (for future API integration)
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
      // If API fails, return the static login result
      const staticResponse = this.staticLogin(credentials);
      if (staticResponse.success && staticResponse.data) {
        this.setToken(staticResponse.data.token);
        this.setRefreshToken(staticResponse.data.refreshToken);
        this.setUser(staticResponse.data.user);
        apiClient.setAuthToken(staticResponse.data.token);
      }
      return staticResponse;
    }
  }

  // Static registration function (fallback for development)
  private static staticRegister(userData: RegisterRequest): RegisterResponse {
    // Check if username already exists
    const existingUsername = this.STATIC_ACCOUNTS.find(
      (acc) => acc.username === userData.username
    );
    if (existingUsername) {
      return {
        success: false,
        message: "Registration failed",
        data: null,
        errors: ["Username already exists"],
      };
    }

    // Check if email already exists (mock check)
    const existingEmail = this.STATIC_ACCOUNTS.find(
      (acc) => acc.user.email === userData.email
    );
    if (existingEmail) {
      return {
        success: false,
        message: "Registration failed",
        data: null,
        errors: ["Email already exists"],
      };
    }

    // Create new user
    const newUser: User = {
      userId: `${Date.now()}`, // Simple ID generation for demo
      username: userData.username,
      email: userData.email,
      fullName: userData.fullName,
      roleId: userData.roleId || 3, // Default to User role
      roleName: userData.roleId === 4 ? "Viewer" : "User",
      isActive: true,
    };

    // In a real app, you would save this to a database
    // For demo purposes, we'll just return success
    return {
      success: true,
      message: "User registered successfully",
      data: { user: newUser },
      errors: [],
    };
  }

  // Register new user
  static async register(userData: RegisterRequest): Promise<RegisterResponse> {
    console.log("AuthService: Starting registration with data:", userData);

    try {
      // Try API registration first
      console.log("AuthService: Attempting API registration");
      const response = await apiClient.post<RegisterResponse>(
        AUTH_ENDPOINTS.REGISTER,
        userData
      );
      console.log("AuthService: API registration successful:", response);
      return response;
    } catch (error) {
      console.warn(
        "AuthService: API registration failed, using fallback registration:",
        error
      );

      // Fallback to static registration for development
      const staticResponse = this.staticRegister(userData);
      console.log("AuthService: Static registration result:", staticResponse);
      return staticResponse;
    }
  }

  // Refresh authentication token
  static async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = this.getRefreshToken();
      const currentUser = this.getUser();

      if (!refreshToken || !currentUser) {
        return false;
      }

      // For static accounts, generate a new token
      const staticAccount = this.STATIC_ACCOUNTS.find(
        (acc) => acc.user.userId === currentUser.userId
      );

      if (staticAccount) {
        const newToken = this.generateMockToken(staticAccount.user);
        const newRefreshToken = this.generateMockToken(staticAccount.user);

        this.setToken(newToken);
        this.setRefreshToken(newRefreshToken);
        this.setUser(staticAccount.user);
        apiClient.setAuthToken(newToken);
        return true;
      }

      // Try API refresh if not a static account
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
      console.error("Token refresh failed:", error);
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
