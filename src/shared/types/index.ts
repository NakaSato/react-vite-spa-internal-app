// This file exports TypeScript interfaces and types used throughout the application for type safety.

export * from "./auth";
export * from "./api";
// Selective exports to avoid conflicts
export type {
  DailyReportDto,
  CreateDailyReportRequest,
  EnhancedDailyReportDto,
  WeeklySummaryDto,
} from "./reports";
export type {
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
} from "./project";
export type {
  ProjectEntity,
  ActivityStatus,
  ProjectStatus,
} from "./project-management";
export type {
  ProjectSchedule,
  ScheduleHealth,
  Milestone,
  GanttData,
  GanttTask,
} from "./schedule";
export type {
  TaskFilters,
  TaskDependency,
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskDto,
} from "./task";
export type {
  ProjectKPIs,
  ProgressTrends,
  PerformanceMetrics,
  RiskIndicator,
  BurndownData,
  ResourceAllocation,
  KPITarget,
} from "./kpi";

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
