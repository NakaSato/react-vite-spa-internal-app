// Authentication types
export interface User {
  userId: string;
  username: string;
  email: string;
  fullName: string;
  roleName: string;
  roleId: number;
  isActive: boolean;
}

export interface LoginRequest {
  username: string; // Can be username or email
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    refreshToken: string;
    user: User;
  } | null;
  errors: string[];
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
  roleId?: number; // Optional, defaults to User role
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
  } | null;
  errors: string[];
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<boolean>;
  logout: () => void;
  register: (userData: RegisterRequest) => Promise<boolean>;
  refreshToken: () => Promise<boolean>;
}

// Role types
export enum UserRole {
  ADMIN = 1,
  MANAGER = 2,
  USER = 3,
  VIEWER = 4,
}

export interface Role {
  id: number;
  name: string;
  description: string;
  permissions: Permission[];
}

export interface Permission {
  id: number;
  name: string;
  resource: string;
  action: string; // 'create' | 'read' | 'update' | 'delete'
}

// Token payload
export interface TokenPayload {
  userId: string;
  username: string;
  email: string;
  roleId: number;
  roleName: string;
  exp: number;
  iat: number;
}

// API endpoints for auth
export const AUTH_ENDPOINTS = {
  LOGIN: "/api/v1/auth/login",
  REGISTER: "/api/v1/auth/register",
  REFRESH: "/api/v1/auth/refresh",
  LOGOUT: "/api/v1/auth/logout",
  PROFILE: "/api/v1/auth/profile",
  CHANGE_PASSWORD: "/api/v1/auth/change-password",
} as const;
