// Master Plan API Service
// Implements the RESTful API specification from MASTER_PLAN_OF_PROJECT.md

import { ApiClient } from "./apiClient";
import {
  ProjectEntity,
  ProjectListResponse,
  ProjectDetailResponse,
  CreateProjectRequest,
  UpdateProgressRequest,
  ProgressCalculation,
  GanttData,
  TaskDependency,
  Document,
  CreateActivityRequest,
  Resource,
  Notification,
} from "../types/project-management";
import { ApiResponse } from "../types/api";

export class MasterPlanApiService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient();
  }

  // ========================================
  // PROJECT OPERATIONS
  // ========================================

  /**
   * GET /api/projects/{id}
   * Retrieves the full details of a single project, including its nested phases and activities
   */
  async getProject(projectId: string): Promise<ProjectEntity> {
    const response = await this.apiClient.get<ApiResponse<ProjectEntity>>(
      `/api/projects/${projectId}`
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to fetch project");
    }

    return response.data;
  }

  /**
   * GET /api/projects
   * Retrieves a list of all projects with pagination, filtering, and sorting
   */
  async getProjects(params?: {
    page?: number;
    pageSize?: number;
    status?: string;
    owner?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<ProjectListResponse> {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.pageSize)
      queryParams.append("pageSize", params.pageSize.toString());
    if (params?.status) queryParams.append("status", params.status);
    if (params?.owner) queryParams.append("owner", params.owner);
    if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params?.sortOrder) queryParams.append("sortOrder", params.sortOrder);

    const response = await this.apiClient.get<ApiResponse<ProjectListResponse>>(
      `/api/projects?${queryParams.toString()}`
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to fetch projects");
    }

    return response.data;
  }

  /**
   * POST /api/projects
   * Creates a new project with all phases and activities
   */
  async createProject(
    projectRequest: CreateProjectRequest
  ): Promise<ProjectEntity> {
    const response = await this.apiClient.post<ApiResponse<ProjectEntity>>(
      "/api/projects",
      projectRequest
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to create project");
    }

    return response.data;
  }

  /**
   * PUT /api/projects/{id}
   * Updates an existing project
   */
  async updateProject(
    projectId: string,
    updates: Partial<CreateProjectRequest>
  ): Promise<ProjectEntity> {
    const response = await this.apiClient.put<ApiResponse<ProjectEntity>>(
      `/api/projects/${projectId}`,
      updates
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to update project");
    }

    return response.data;
  }

  /**
   * DELETE /api/projects/{id}
   * Deletes a project and all its associated data
   */
  async deleteProject(projectId: string): Promise<void> {
    const response = await this.apiClient.delete<ApiResponse<void>>(
      `/api/projects/${projectId}`
    );

    if (!response.success) {
      throw new Error(response.message || "Failed to delete project");
    }
  }

  // ========================================
  // GANTT CHART OPERATIONS
  // ========================================

  /**
   * GET /api/projects/{id}/gantt
   * Retrieves project data specifically formatted for consumption by the Gantt chart component
   */
  async getProjectGanttData(projectId: string): Promise<GanttData> {
    const response = await this.apiClient.get<ApiResponse<GanttData>>(
      `/api/projects/${projectId}/gantt`
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to fetch Gantt data");
    }

    return response.data;
  }

  /**
   * GET /api/projects/{id}/detail
   * Retrieves comprehensive project details including Gantt data and progress calculation
   */
  async getProjectDetail(projectId: string): Promise<ProjectDetailResponse> {
    const response = await this.apiClient.get<
      ApiResponse<ProjectDetailResponse>
    >(`/api/projects/${projectId}/detail`);

    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to fetch project details");
    }

    return response.data;
  }

  // ========================================
  // PROGRESS TRACKING OPERATIONS
  // ========================================

  /**
   * GET /api/projects/{id}/progress
   * Calculates and returns the current weighted completion percentage for the project and each of its phases
   */
  async getProjectProgress(projectId: string): Promise<ProgressCalculation> {
    const response = await this.apiClient.get<ApiResponse<ProgressCalculation>>(
      `/api/projects/${projectId}/progress`
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to fetch project progress");
    }

    return response.data;
  }

  /**
   * PUT /api/activities/{id}/progress
   * Updates the completion percentage of a single activity
   */
  async updateActivityProgress(
    activityId: string,
    progressUpdate: UpdateProgressRequest
  ): Promise<void> {
    const response = await this.apiClient.put<ApiResponse<void>>(
      `/api/activities/${activityId}/progress`,
      progressUpdate
    );

    if (!response.success) {
      throw new Error(response.message || "Failed to update activity progress");
    }
  }

  /**
   * POST /api/activities/{id}/progress/batch
   * Updates progress for multiple activities at once
   */
  async updateMultipleActivitiesProgress(
    updates: UpdateProgressRequest[]
  ): Promise<void> {
    const response = await this.apiClient.post<ApiResponse<void>>(
      "/api/activities/progress/batch",
      { updates }
    );

    if (!response.success) {
      throw new Error(
        response.message || "Failed to update activities progress"
      );
    }
  }

  // ========================================
  // DEPENDENCY MANAGEMENT
  // ========================================

  /**
   * GET /api/projects/{id}/dependencies
   * Gets all task dependencies for a project
   */
  async getProjectDependencies(projectId: string): Promise<TaskDependency[]> {
    const response = await this.apiClient.get<ApiResponse<TaskDependency[]>>(
      `/api/projects/${projectId}/dependencies`
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to fetch dependencies");
    }

    return response.data;
  }

  /**
   * POST /api/dependencies
   * Creates a new dependency link between two activities
   */
  async createDependency(
    dependency: Omit<TaskDependency, "dependencyId">
  ): Promise<TaskDependency> {
    const response = await this.apiClient.post<ApiResponse<TaskDependency>>(
      "/api/dependencies",
      dependency
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to create dependency");
    }

    return response.data;
  }

  /**
   * DELETE /api/dependencies/{id}
   * Deletes a dependency link
   */
  async deleteDependency(dependencyId: string): Promise<void> {
    const response = await this.apiClient.delete<ApiResponse<void>>(
      `/api/dependencies/${dependencyId}`
    );

    if (!response.success) {
      throw new Error(response.message || "Failed to delete dependency");
    }
  }

  // ========================================
  // DOCUMENT MANAGEMENT
  // ========================================

  /**
   * GET /api/activities/{id}/documents
   * Lists all documents associated with a specific activity
   */
  async getActivityDocuments(activityId: string): Promise<Document[]> {
    const response = await this.apiClient.get<ApiResponse<Document[]>>(
      `/api/activities/${activityId}/documents`
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to fetch documents");
    }

    return response.data;
  }

  /**
   * POST /api/activities/{id}/documents
   * Uploads a new document for an activity (multipart/form-data request)
   */
  async uploadActivityDocument(
    activityId: string,
    file: File,
    metadata: {
      documentName: string;
      description?: string;
      version?: number;
    }
  ): Promise<Document> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("documentName", metadata.documentName);
    if (metadata.description)
      formData.append("description", metadata.description);
    if (metadata.version)
      formData.append("version", metadata.version.toString());

    const response = await this.apiClient.post<ApiResponse<Document>>(
      `/api/activities/${activityId}/documents`,
      formData
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to upload document");
    }

    return response.data;
  }

  /**
   * DELETE /api/documents/{id}
   * Deletes a document
   */
  async deleteDocument(documentId: string): Promise<void> {
    const response = await this.apiClient.delete<ApiResponse<void>>(
      `/api/documents/${documentId}`
    );

    if (!response.success) {
      throw new Error(response.message || "Failed to delete document");
    }
  }

  /**
   * GET /api/documents/{id}/download
   * Downloads a document file
   */
  async downloadDocument(documentId: string): Promise<string> {
    // Return download URL for client-side handling
    const response = await this.apiClient.get<
      ApiResponse<{ downloadUrl: string }>
    >(`/api/documents/${documentId}/download`);

    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to get download URL");
    }

    return response.data.downloadUrl;
  }

  // ========================================
  // RESOURCE MANAGEMENT
  // ========================================

  /**
   * GET /api/resources
   * Gets all available resources
   */
  async getResources(): Promise<Resource[]> {
    const response = await this.apiClient.get<ApiResponse<Resource[]>>(
      "/api/resources"
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to fetch resources");
    }

    return response.data;
  }

  /**
   * POST /api/resources
   * Creates a new resource
   */
  async createResource(
    resource: Omit<Resource, "resourceId">
  ): Promise<Resource> {
    const response = await this.apiClient.post<ApiResponse<Resource>>(
      "/api/resources",
      resource
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to create resource");
    }

    return response.data;
  }

  /**
   * GET /api/projects/{id}/resource-conflicts
   * Detects resource conflicts for a project
   */
  async getResourceConflicts(projectId: string): Promise<
    Array<{
      resourceId: string;
      conflictingActivities: string[];
      conflictPeriod: { start: Date; end: Date };
    }>
  > {
    const response = await this.apiClient.get<
      ApiResponse<
        Array<{
          resourceId: string;
          conflictingActivities: string[];
          conflictPeriod: { start: Date; end: Date };
        }>
      >
    >(`/api/projects/${projectId}/resource-conflicts`);

    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to fetch resource conflicts");
    }

    return response.data;
  }

  // ========================================
  // ACTIVITY MANAGEMENT
  // ========================================

  /**
   * POST /api/phases/{id}/activities
   * Creates a new activity within a phase
   */
  async createActivity(
    phaseId: string,
    activity: CreateActivityRequest
  ): Promise<void> {
    const response = await this.apiClient.post<ApiResponse<void>>(
      `/api/phases/${phaseId}/activities`,
      activity
    );

    if (!response.success) {
      throw new Error(response.message || "Failed to create activity");
    }
  }

  /**
   * PUT /api/activities/{id}
   * Updates an existing activity
   */
  async updateActivity(
    activityId: string,
    updates: Partial<CreateActivityRequest>
  ): Promise<void> {
    const response = await this.apiClient.put<ApiResponse<void>>(
      `/api/activities/${activityId}`,
      updates
    );

    if (!response.success) {
      throw new Error(response.message || "Failed to update activity");
    }
  }

  /**
   * DELETE /api/activities/{id}
   * Deletes an activity
   */
  async deleteActivity(activityId: string): Promise<void> {
    const response = await this.apiClient.delete<ApiResponse<void>>(
      `/api/activities/${activityId}`
    );

    if (!response.success) {
      throw new Error(response.message || "Failed to delete activity");
    }
  }

  // ========================================
  // CRITICAL PATH ANALYSIS
  // ========================================

  /**
   * GET /api/projects/{id}/critical-path
   * Calculates and returns the critical path for a project
   */
  async getCriticalPath(projectId: string): Promise<string[]> {
    const response = await this.apiClient.get<ApiResponse<string[]>>(
      `/api/projects/${projectId}/critical-path`
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to calculate critical path");
    }

    return response.data;
  }

  // ========================================
  // NOTIFICATIONS
  // ========================================

  /**
   * GET /api/notifications
   * Gets notifications for the current user
   */
  async getNotifications(params?: {
    page?: number;
    pageSize?: number;
    unreadOnly?: boolean;
  }): Promise<{
    notifications: Notification[];
    total: number;
    unreadCount: number;
  }> {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.pageSize)
      queryParams.append("pageSize", params.pageSize.toString());
    if (params?.unreadOnly) queryParams.append("unreadOnly", "true");

    const response = await this.apiClient.get<
      ApiResponse<{
        notifications: Notification[];
        total: number;
        unreadCount: number;
      }>
    >(`/api/notifications?${queryParams.toString()}`);

    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to fetch notifications");
    }

    return response.data;
  }

  /**
   * PUT /api/notifications/{id}/read
   * Marks a notification as read
   */
  async markNotificationAsRead(notificationId: string): Promise<void> {
    const response = await this.apiClient.put<ApiResponse<void>>(
      `/api/notifications/${notificationId}/read`,
      {}
    );

    if (!response.success) {
      throw new Error(
        response.message || "Failed to mark notification as read"
      );
    }
  }

  // ========================================
  // REPORTING AND ANALYTICS
  // ========================================

  /**
   * GET /api/projects/{id}/reports/progress
   * Generates a comprehensive progress report
   */
  async generateProgressReport(projectId: string): Promise<{
    reportData: any;
    generatedAt: Date;
    reportUrl?: string;
  }> {
    const response = await this.apiClient.get<
      ApiResponse<{
        reportData: any;
        generatedAt: Date;
        reportUrl?: string;
      }>
    >(`/api/projects/${projectId}/reports/progress`);

    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to generate progress report");
    }

    return response.data;
  }

  /**
   * GET /api/projects/{id}/reports/performance
   * Generates a performance analysis report
   */
  async generatePerformanceReport(projectId: string): Promise<{
    schedulePerformance: number;
    budgetPerformance?: number;
    qualityMetrics: any;
    recommendations: string[];
  }> {
    const response = await this.apiClient.get<
      ApiResponse<{
        schedulePerformance: number;
        budgetPerformance?: number;
        qualityMetrics: any;
        recommendations: string[];
      }>
    >(`/api/projects/${projectId}/reports/performance`);

    if (!response.success || !response.data) {
      throw new Error(
        response.message || "Failed to generate performance report"
      );
    }

    return response.data;
  }

  // ========================================
  // DASHBOARD STATISTICS
  // ========================================

  /**
   * GET /api/dashboard/stats
   * Gets dashboard statistics for all projects
   */
  async getDashboardStats(): Promise<{
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    overallProgress: number;
    projectsAtRisk: number;
    upcomingDeadlines: Array<{
      projectId: string;
      projectName: string;
      deadline: Date;
      daysRemaining: number;
    }>;
  }> {
    const response = await this.apiClient.get<
      ApiResponse<{
        totalProjects: number;
        activeProjects: number;
        completedProjects: number;
        overallProgress: number;
        projectsAtRisk: number;
        upcomingDeadlines: Array<{
          projectId: string;
          projectName: string;
          deadline: Date;
          daysRemaining: number;
        }>;
      }>
    >("/api/dashboard/stats");

    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to fetch dashboard stats");
    }

    return response.data;
  }
}

// Export a singleton instance
export const masterPlanApi = new MasterPlanApiService();
