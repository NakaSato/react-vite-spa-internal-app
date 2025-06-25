// This file exports TypeScript interfaces and types used throughout the application for type safety.

export * from "./auth";
export * from "./api";
export * from "./project";

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export type Nullable<T> = T | null;
