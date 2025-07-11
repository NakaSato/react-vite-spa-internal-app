import { apiClient } from "./apiClient";
import { mockProjects } from "../data/mockProjects";
import {
  CreateProjectRequest,
  ProjectDto,
  UpdateProjectRequest,
  EnhancedCreateProjectRequest,
  EnhancedUpdateProjectRequest,
  UpdateProjectStatusRequest,
  ProjectStatusUpdateResponse,
  ProjectSearchRequest,
  ProjectSearchResponse,
  ProjectAnalyticsParams,
  GetProjectsParams,
  ProjectTemplateDto,
  CreateProjectFromTemplateRequest,
  ProjectStatusDto,
  ProjectAnalyticsDto,
  ProjectPerformanceDto,
  ProjectValidationResult,
  ProjectStatusWorkflow,
  BulkProjectOperation,
  BulkProjectOperationResult,
  RealTimeProjectUpdate,
} from "../types/project";
import { ApiResponse, EnhancedPagedResult } from "../types/api";

/**
 * Projects API Service with Mock Data Fallback
 *
 * This service attempts to use the real API first, but falls back to mock data
 * when the backend is not available. This enables development and testing
 * without requiring a fully configured backend.
 */
export class ProjectsApiServiceWithFallback {
  private readonly endpoint = "/api/v1/projects";

  /**
   * Convert mock Project to ProjectDto format
   */
  private convertMockToDto(mockProject: any): ProjectDto {
    return {
      id: mockProject.id,
      name: mockProject.name,
      description: `${mockProject.client} - ${mockProject.systemSize} system`,
      clientName: mockProject.client,
      clientEmail: `${mockProject.client
        .toLowerCase()
        .replace(/\s+/g, ".")}@example.com`,
      clientPhone: "+1-555-0123",
      status: mockProject.status,
      progress: mockProject.progress,
      startDate: mockProject.startDate,
      expectedCompletionDate: mockProject.expectedCompletion,
      actualCompletionDate:
        mockProject.status === "Completed"
          ? mockProject.expectedCompletion
          : null,
      systemSize: mockProject.systemSize,
      location: mockProject.location,
      priority: mockProject.priority,
      assignedTeamIds: mockProject.assignedTeam,
      budget: mockProject.budget,
      spent: mockProject.spent,
      managerId: "user-123",
      createdAt: new Date(mockProject.startDate).toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
      tags: [],
      metadata: {},
      isActive: true,
      lastStatusUpdate: new Date().toISOString(),
      estimatedCompletionDate: mockProject.expectedCompletion,
      actualStartDate: mockProject.startDate,
      milestones: [],
      dependencies: [],
      riskLevel: "Low",
      weatherImpact: "None",
      permitStatus: "Approved",
      inspectionStatus: "Pending",
      interconnectionStatus: "Pending",
      financingStatus: "Secured",
      documents: [],
      teamAssignments: [],
      resourceAllocations: [],
      qualityMetrics: {},
      complianceStatus: "Compliant",
      environmentalImpact: {},
      roi: 0,
      paybackPeriod: 0,
      energyProduction: 0,
      carbonOffset: 0,
      maintenanceSchedule: [],
      warrantyInfo: {},
      insuranceInfo: {},
      performanceMetrics: {},
      communicationLog: [],
      changeRequests: [],
      issues: [],
      risks: [],
      approvals: [],
      invoices: [],
      payments: [],
      contracts: [],
      specifications: {},
      drawings: [],
      photos: [],
      reports: [],
      certificates: [],
      notifications: [],
      auditTrail: [],
      integrations: {},
      customFields: {},
      workflowState: {},
      automationRules: [],
      alerts: [],
      dashboardConfig: {},
      reportingConfig: {},
      apiConfig: {},
      syncStatus: "Synced",
      lastSyncAt: new Date().toISOString(),
    };
  }

  /**
   * Get all projects with fallback to mock data
   */
  async getAllProjects(
    params?: GetProjectsParams
  ): Promise<EnhancedPagedResult<ProjectDto>> {
    try {
      console.log(
        "🔄 [ProjectsApiServiceWithFallback.getAllProjects] Attempting API call..."
      );

      // Try the real API first
      const queryParams = new URLSearchParams();
      if (params?.pageNumber)
        queryParams.append("pageNumber", params.pageNumber.toString());
      if (params?.pageSize)
        queryParams.append("pageSize", params.pageSize.toString());
      if (params?.status) queryParams.append("status", params.status);
      if (params?.search) queryParams.append("search", params.search);
      if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
      if (params?.sortOrder) queryParams.append("sortOrder", params.sortOrder);

      const url = queryParams.toString()
        ? `${this.endpoint}?${queryParams}`
        : this.endpoint;

      const response = await apiClient.get<
        ApiResponse<EnhancedPagedResult<ProjectDto>>
      >(url);

      console.log(
        "✅ [ProjectsApiServiceWithFallback.getAllProjects] API call successful"
      );
      return (
        response.data || {
          items: [],
          totalCount: 0,
          pageNumber: 1,
          pageSize: 10,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
          pagination: {
            pageNumber: 1,
            pageSize: 10,
            totalCount: 0,
            totalPages: 0,
          },
          metadata: {},
        }
      );
    } catch (error: any) {
      console.warn(
        "⚠️ [ProjectsApiServiceWithFallback.getAllProjects] API call failed, falling back to mock data"
      );
      console.warn("Error details:", error.message);

      // Fallback to mock data
      const mockDtos = mockProjects.map((project) =>
        this.convertMockToDto(project)
      );

      // Apply basic filtering
      let filteredProjects = mockDtos;
      if (params?.status) {
        filteredProjects = mockDtos.filter((p) => p.status === params.status);
      }
      if (params?.search) {
        const searchLower = params.search.toLowerCase();
        filteredProjects = filteredProjects.filter(
          (p) =>
            p.name.toLowerCase().includes(searchLower) ||
            p.clientName.toLowerCase().includes(searchLower) ||
            p.location.toLowerCase().includes(searchLower)
        );
      }

      // Apply pagination
      const pageNumber = params?.pageNumber || 1;
      const pageSize = params?.pageSize || 10;
      const startIndex = (pageNumber - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedItems = filteredProjects.slice(startIndex, endIndex);

      return {
        items: paginatedItems,
        totalCount: filteredProjects.length,
        pageNumber,
        pageSize,
        totalPages: Math.ceil(filteredProjects.length / pageSize),
        hasNextPage: endIndex < filteredProjects.length,
        hasPreviousPage: pageNumber > 1,
        pagination: {
          pageNumber,
          pageSize,
          totalCount: filteredProjects.length,
          totalPages: Math.ceil(filteredProjects.length / pageSize),
        },
        metadata: {
          usedMockData: true,
          apiError: error.message,
        },
      };
    }
  }

  /**
   * Get project by ID with fallback to mock data
   */
  async getProjectById(projectId: string): Promise<ProjectDto | null> {
    try {
      console.log(
        `🔄 [ProjectsApiServiceWithFallback.getProjectById] Attempting API call for ID: ${projectId}`
      );

      const response = await apiClient.get<ApiResponse<ProjectDto>>(
        `${this.endpoint}/${projectId}`
      );

      console.log(
        "✅ [ProjectsApiServiceWithFallback.getProjectById] API call successful"
      );
      return response.data || null;
    } catch (error: any) {
      console.warn(
        `⚠️ [ProjectsApiServiceWithFallback.getProjectById] API call failed for ID: ${projectId}, falling back to mock data`
      );
      console.warn("Error details:", error.message);

      // Fallback to mock data
      const mockProject = mockProjects.find((p) => p.id === projectId);
      if (mockProject) {
        console.log(
          `✅ [ProjectsApiServiceWithFallback.getProjectById] Found mock project: ${mockProject.name}`
        );
        return this.convertMockToDto(mockProject);
      }

      console.log(
        `❌ [ProjectsApiServiceWithFallback.getProjectById] Project not found in mock data: ${projectId}`
      );
      return null;
    }
  }

  /**
   * Create project (API only, no mock fallback)
   */
  async createProject(project: CreateProjectRequest): Promise<ProjectDto> {
    const response = await apiClient.post<ApiResponse<ProjectDto>>(
      this.endpoint,
      project
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to create project");
    }

    return response.data;
  }

  /**
   * Update project (API only, no mock fallback)
   */
  async updateProject(
    projectId: string,
    updates: UpdateProjectRequest
  ): Promise<ProjectDto> {
    const response = await apiClient.put<ApiResponse<ProjectDto>>(
      `${this.endpoint}/${projectId}`,
      updates
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to update project");
    }

    return response.data;
  }

  /**
   * Delete project (API only, no mock fallback)
   */
  async deleteProject(projectId: string): Promise<void> {
    const response = await apiClient.delete<ApiResponse<void>>(
      `${this.endpoint}/${projectId}`
    );

    if (!response.success) {
      throw new Error(response.message || "Failed to delete project");
    }
  }
}

// Create singleton instance
export const projectsApiService = new ProjectsApiServiceWithFallback();
