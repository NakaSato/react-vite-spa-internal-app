import { ApiClient } from "../../utils/apiClient";
import { ApiResponse, EnhancedPagedResult } from "../../types/api";
import {
  DailyReportDto,
  CreateDailyReportRequest,
  UpdateDailyReportRequest,
  GetDailyReportsParams,
  DailyReportAnalytics,
  DailyReportValidationResult,
  DailyReportTemplate,
  DailyReportExportRequest,
  BulkApprovalRequest,
  BulkRejectionRequest,
  BulkOperationResult,
  DailyReportUpdateNotification,
} from "../../types/project";

/**
 * Daily Reports API module
 * Handles all daily report management endpoints
 */
export class DailyReportsApi {
  constructor(private apiClient: ApiClient) {}

  /**
   * Get daily reports with filtering and pagination
   */
  async getDailyReports(params?: {
    ProjectId?: string;
    ReporterId?: string;
    Status?: string;
    ReportDateAfter?: string;
    ReportDateBefore?: string;
    WeatherCondition?: string;
    CreatedAfter?: string;
    CreatedBefore?: string;
    UpdatedAfter?: string;
    UpdatedBefore?: string;
    HasWorkProgress?: boolean;
    HasIssues?: boolean;
    PageNumber?: number;
    PageSize?: number;
    SortBy?: string;
    SortOrder?: string;
    Search?: string;
    Fields?: string;
  }): Promise<ApiResponse<EnhancedPagedResult<DailyReportDto>>> {
    const queryString = params
      ? new URLSearchParams(params as any).toString()
      : "";
    return this.apiClient.get<ApiResponse<EnhancedPagedResult<DailyReportDto>>>(
      `/api/v1/daily-reports${queryString ? `?${queryString}` : ""}`
    );
  }

  /**
   * Get daily report by ID
   */
  async getDailyReport(id: string): Promise<ApiResponse<DailyReportDto>> {
    return this.apiClient.get<ApiResponse<DailyReportDto>>(
      `/api/v1/daily-reports/${id}`
    );
  }

  /**
   * Create new daily report
   */
  async createDailyReport(
    report: CreateDailyReportRequest
  ): Promise<ApiResponse<DailyReportDto>> {
    return this.apiClient.post<ApiResponse<DailyReportDto>>(
      "/api/v1/daily-reports",
      report
    );
  }

  /**
   * Update daily report
   */
  async updateDailyReport(
    id: string,
    report: Partial<CreateDailyReportRequest>
  ): Promise<ApiResponse<DailyReportDto>> {
    return this.apiClient.put<ApiResponse<DailyReportDto>>(
      `/api/v1/daily-reports/${id}`,
      report
    );
  }

  /**
   * Delete daily report
   */
  async deleteDailyReport(id: string): Promise<ApiResponse<boolean>> {
    return this.apiClient.delete<ApiResponse<boolean>>(
      `/api/v1/daily-reports/${id}`
    );
  }

  /**
   * Approve daily report
   */
  async approveDailyReport(id: string): Promise<ApiResponse<DailyReportDto>> {
    return this.apiClient.post<ApiResponse<DailyReportDto>>(
      `/api/v1/daily-reports/${id}/approve`
    );
  }

  /**
   * Reject daily report
   */
  async rejectDailyReport(
    id: string,
    rejectionReason: string
  ): Promise<ApiResponse<DailyReportDto>> {
    return this.apiClient.post<ApiResponse<DailyReportDto>>(
      `/api/v1/daily-reports/${id}/reject`,
      { rejectionReason }
    );
  }

  /**
   * Submit daily report for approval
   */
  async submitDailyReportForApproval(
    id: string
  ): Promise<ApiResponse<DailyReportDto>> {
    return this.apiClient.post<ApiResponse<DailyReportDto>>(
      `/api/v1/daily-reports/${id}/submit`
    );
  }

  /**
   * Get daily reports for specific project
   */
  async getDailyReportsByProject(
    projectId: string,
    params?: {
      StartDate?: string;
      EndDate?: string;
      ExactDate?: string;
      ApprovalStatuses?: string[];
      HasCriticalIssues?: boolean;
      RequiresManagerAttention?: boolean;
      PageNumber?: number;
      PageSize?: number;
    }
  ): Promise<ApiResponse<EnhancedPagedResult<DailyReportDto>>> {
    const queryString = params
      ? new URLSearchParams(params as any).toString()
      : "";
    return this.apiClient.get<ApiResponse<EnhancedPagedResult<DailyReportDto>>>(
      `/api/v1/daily-reports/projects/${projectId}${
        queryString ? `?${queryString}` : ""
      }`
    );
  }

  /**
   * Get pending approval reports
   */
  async getPendingApprovalReports(params?: {
    projectId?: string;
    pageNumber?: number;
    pageSize?: number;
  }): Promise<ApiResponse<EnhancedPagedResult<DailyReportDto>>> {
    const queryString = params
      ? new URLSearchParams(params as any).toString()
      : "";
    return this.apiClient.get<ApiResponse<EnhancedPagedResult<DailyReportDto>>>(
      `/api/v1/daily-reports/pending-approval${
        queryString ? `?${queryString}` : ""
      }`
    );
  }

  /**
   * Get daily report analytics
   */
  async getDailyReportAnalytics(
    projectId: string,
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<DailyReportAnalytics>> {
    return this.apiClient.get<ApiResponse<DailyReportAnalytics>>(
      `/api/v1/daily-reports/analytics/${projectId}?startDate=${startDate}&endDate=${endDate}`
    );
  }

  /**
   * Validate daily report
   */
  async validateDailyReport(
    reportData: CreateDailyReportRequest
  ): Promise<ApiResponse<DailyReportValidationResult>> {
    return this.apiClient.post<ApiResponse<DailyReportValidationResult>>(
      "/api/v1/daily-reports/validate",
      reportData
    );
  }

  /**
   * Bulk approve daily reports
   */
  async bulkApproveDailyReports(
    request: BulkApprovalRequest
  ): Promise<ApiResponse<BulkOperationResult>> {
    return this.apiClient.post<ApiResponse<BulkOperationResult>>(
      "/api/v1/daily-reports/bulk-approve",
      request
    );
  }

  /**
   * Bulk reject daily reports
   */
  async bulkRejectDailyReports(
    request: BulkRejectionRequest
  ): Promise<ApiResponse<BulkOperationResult>> {
    return this.apiClient.post<ApiResponse<BulkOperationResult>>(
      "/api/v1/daily-reports/bulk-reject",
      request
    );
  }

  /**
   * Export daily reports
   */
  async exportDailyReports(
    request: DailyReportExportRequest
  ): Promise<ApiResponse<{ downloadUrl: string; fileName: string }>> {
    return this.apiClient.post<
      ApiResponse<{ downloadUrl: string; fileName: string }>
    >("/api/v1/daily-reports/export", request);
  }

  /**
   * Get daily report templates
   */
  async getDailyReportTemplates(
    projectId?: string
  ): Promise<ApiResponse<DailyReportTemplate[]>> {
    const params = projectId ? `?projectId=${projectId}` : "";
    return this.apiClient.get<ApiResponse<DailyReportTemplate[]>>(
      `/api/v1/daily-reports/templates${params}`
    );
  }

  /**
   * Create daily report template
   */
  async createDailyReportTemplate(
    templateData: Partial<DailyReportTemplate>
  ): Promise<ApiResponse<DailyReportTemplate>> {
    return this.apiClient.post<ApiResponse<DailyReportTemplate>>(
      "/api/v1/daily-reports/templates",
      templateData
    );
  }

  /**
   * Update daily report template
   */
  async updateDailyReportTemplate(
    id: string,
    templateData: Partial<DailyReportTemplate>
  ): Promise<ApiResponse<DailyReportTemplate>> {
    return this.apiClient.put<ApiResponse<DailyReportTemplate>>(
      `/api/v1/daily-reports/templates/${id}`,
      templateData
    );
  }

  /**
   * Delete daily report template
   */
  async deleteDailyReportTemplate(id: string): Promise<ApiResponse<boolean>> {
    return this.apiClient.delete<ApiResponse<boolean>>(
      `/api/v1/daily-reports/templates/${id}`
    );
  }

  /**
   * Get daily reports for real-time updates
   */
  async getDailyReportUpdates(
    projectId: string,
    lastUpdated?: string
  ): Promise<ApiResponse<DailyReportUpdateNotification[]>> {
    const params = lastUpdated ? `?lastUpdated=${lastUpdated}` : "";
    return this.apiClient.get<ApiResponse<DailyReportUpdateNotification[]>>(
      `/api/v1/daily-reports/updates/${projectId}${params}`
    );
  }

  /**
   * Get daily reports with enhanced search
   */
  async searchDailyReports(
    params: GetDailyReportsParams
  ): Promise<ApiResponse<EnhancedPagedResult<DailyReportDto>>> {
    const queryString = new URLSearchParams(params as any).toString();
    return this.apiClient.get<ApiResponse<EnhancedPagedResult<DailyReportDto>>>(
      `/api/v1/daily-reports/search?${queryString}`
    );
  }
}
