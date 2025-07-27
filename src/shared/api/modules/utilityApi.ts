import { ApiClient } from "../../utils/apiClient";
import {
  ApiResponse,
  EnhancedPagedResult,
  TaskDto,
  CreateTaskRequest,
  UpdateTaskRequest,
  CalendarEventDto,
  CreateCalendarEventDto,
  MasterPlanDto,
  CreateMasterPlanRequest,
  ProjectPhaseDto,
  ProjectMilestoneDto,
  ResourceDto,
  WorkRequestDto,
  NotificationDto,
  DocumentDto,
  ImageMetadataDto,
  DashboardOverviewDto,
  WeeklyReportDto,
} from "../../types/api";
import { User } from "../../types/auth";

/**
 * Utility API module
 * Handles miscellaneous endpoints (tasks, calendar, users, notifications, etc.)
 */
export class UtilityApi {
  constructor(private apiClient: ApiClient) {}

  // ============================================================================
  // TASKS ENDPOINTS
  // ============================================================================

  /**
   * Get tasks with pagination
   */
  async getTasks(params?: {
    pageNumber?: number;
    pageSize?: number;
    projectId?: string;
    assigneeId?: string;
  }): Promise<ApiResponse<EnhancedPagedResult<TaskDto>>> {
    const queryString = params
      ? new URLSearchParams(params as any).toString()
      : "";
    return this.apiClient.get<ApiResponse<EnhancedPagedResult<TaskDto>>>(
      `/api/v1/tasks${queryString ? `?${queryString}` : ""}`
    );
  }

  /**
   * Create new task
   */
  async createTask(
    task: CreateTaskRequest,
    projectId?: string
  ): Promise<ApiResponse<TaskDto>> {
    const queryString = projectId ? `?projectId=${projectId}` : "";
    return this.apiClient.post<ApiResponse<TaskDto>>(
      `/api/v1/tasks${queryString}`,
      task
    );
  }

  /**
   * Get task by ID
   */
  async getTask(id: string): Promise<ApiResponse<TaskDto>> {
    return this.apiClient.get<ApiResponse<TaskDto>>(`/api/v1/tasks/${id}`);
  }

  /**
   * Update task
   */
  async updateTask(
    id: string,
    task: UpdateTaskRequest
  ): Promise<ApiResponse<TaskDto>> {
    return this.apiClient.put<ApiResponse<TaskDto>>(
      `/api/v1/tasks/${id}`,
      task
    );
  }

  /**
   * Delete task
   */
  async deleteTask(id: string): Promise<ApiResponse<boolean>> {
    return this.apiClient.delete<ApiResponse<boolean>>(`/api/v1/tasks/${id}`);
  }

  /**
   * Complete task
   */
  async completeTask(
    id: string,
    notes?: string
  ): Promise<ApiResponse<boolean>> {
    return this.apiClient.post<ApiResponse<boolean>>(
      `/api/v1/tasks/${id}/complete`,
      { notes }
    );
  }

  // ============================================================================
  // CALENDAR ENDPOINTS
  // ============================================================================

  /**
   * Get calendar events with filtering
   */
  async getCalendarEvents(params?: {
    StartDate?: string;
    EndDate?: string;
    EventType?: number;
    Status?: number;
    Priority?: number;
    ProjectId?: string;
    TaskId?: string;
    AssignedToUserId?: string;
    CreatedByUserId?: string;
    IncludePrivate?: boolean;
    Search?: string;
    Page?: number;
    PageSize?: number;
    SortBy?: string;
    SortOrder?: string;
  }): Promise<ApiResponse<EnhancedPagedResult<CalendarEventDto>>> {
    const queryString = params
      ? new URLSearchParams(params as any).toString()
      : "";
    return this.apiClient.get<
      ApiResponse<EnhancedPagedResult<CalendarEventDto>>
    >(`/api/v1/Calendar${queryString ? `?${queryString}` : ""}`);
  }

  /**
   * Create calendar event
   */
  async createCalendarEvent(
    event: CreateCalendarEventDto
  ): Promise<ApiResponse<CalendarEventDto>> {
    return this.apiClient.post<ApiResponse<CalendarEventDto>>(
      "/api/v1/Calendar",
      event
    );
  }

  // ============================================================================
  // USERS ENDPOINTS
  // ============================================================================

  /**
   * Get users with pagination
   */
  async getUsers(params?: {
    pageNumber?: number;
    pageSize?: number;
    role?: string;
    isActive?: boolean;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<ApiResponse<EnhancedPagedResult<User>>> {
    const queryString = params
      ? new URLSearchParams(params as any).toString()
      : "";
    return this.apiClient.get<ApiResponse<EnhancedPagedResult<User>>>(
      `/api/v1/users${queryString ? `?${queryString}` : ""}`
    );
  }

  /**
   * Get user by ID
   */
  async getUser(id: string): Promise<ApiResponse<User>> {
    return this.apiClient.get<ApiResponse<User>>(`/api/v1/users/${id}`);
  }

  // ============================================================================
  // DASHBOARD ENDPOINTS
  // ============================================================================

  /**
   * Get dashboard overview
   */
  async getDashboardOverview(): Promise<ApiResponse<DashboardOverviewDto>> {
    return this.apiClient.get<ApiResponse<DashboardOverviewDto>>(
      "/api/v1/dashboard/overview"
    );
  }

  /**
   * Get project progress for dashboard
   */
  async getProjectProgress(): Promise<ApiResponse<any[]>> {
    return this.apiClient.get<ApiResponse<any[]>>(
      "/api/v1/dashboard/project-progress"
    );
  }

  // ============================================================================
  // HEALTH CHECK
  // ============================================================================

  /**
   * Health check endpoint
   */
  async healthCheck(): Promise<any> {
    return this.apiClient.get<any>("/Health");
  }
}
