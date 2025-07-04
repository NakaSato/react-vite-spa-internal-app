// API Response types matching your swagger schema
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string | null;
  data?: T | null;
  errors?: string[] | null;
  error?: unknown;
}

// Error response type
export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

// Pagination types
export interface PaginationInfo {
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface EnhancedPagedResult<T> {
  items: T[] | null;
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  sortBy?: string | null;
  sortOrder?: string | null;
  requestedFields?: string[] | null;
  metadata?: QueryMetadata;
  pagination: PaginationInfo;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface QueryMetadata {
  executionTime: string;
  filtersApplied: number;
  queryComplexity?: string | null;
  queryExecutedAt: string;
  cacheStatus?: string | null;
}

// Health check response
export interface HealthCheckResponse {
  status: string;
  timestamp: string;
  version?: string;
}

// API endpoints based on your swagger documentation
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: "/api/v1/Auth/login",
    REGISTER: "/api/v1/Auth/register",
    REFRESH: "/api/v1/Auth/refresh",
    LOGOUT: "/api/v1/Auth/logout",
  },

  // Health
  HEALTH: "/Health",
  HEALTH_DETAILED: "/Health/detailed",

  // Projects
  PROJECTS: "/api/v1/Projects",
  PROJECT_BY_ID: (id: string) => `/api/v1/Projects/${id}`,
  PROJECT_STATUS: (id: string) => `/api/v1/Projects/${id}/status`,
  PROJECTS_ME: "/api/v1/Projects/me",
  PROJECTS_RICH: "/api/v1/Projects/rich",
  PROJECTS_LEGACY: "/api/v1/Projects/legacy",
  PROJECTS_TEST: "/api/v1/Projects/test",

  // Tasks
  TASKS: "/api/v1/tasks",
  TASK_BY_ID: (id: string) => `/api/v1/tasks/${id}`,
  TASK_STATUS: (id: string) => `/api/v1/tasks/${id}/status`,
  TASKS_ADVANCED: "/api/v1/tasks/advanced",
  TASK_PROGRESS_REPORTS: (taskId: string) =>
    `/api/v1/tasks/${taskId}/progress-reports`,

  // Daily Reports
  DAILY_REPORTS: "/api/v1/daily-reports",
  DAILY_REPORT_BY_ID: (id: string) => `/api/v1/daily-reports/${id}`,
  DAILY_REPORT_APPROVE: (id: string) => `/api/v1/daily-reports/${id}/approve`,
  DAILY_REPORT_REJECT: (id: string) => `/api/v1/daily-reports/${id}/reject`,
  DAILY_REPORTS_WEEKLY_SUMMARY: "/api/v1/daily-reports/weekly-summary",
  DAILY_REPORTS_EXPORT: "/api/v1/daily-reports/export",
  DAILY_REPORTS_BY_PROJECT: (projectId: string) =>
    `/api/v1/daily-reports/projects/${projectId}`,
  DAILY_REPORTS_ENHANCED: "/api/v1/daily-reports/enhanced",
  DAILY_REPORTS_ANALYTICS: (projectId: string) =>
    `/api/v1/daily-reports/projects/${projectId}/analytics`,
  DAILY_REPORTS_WEEKLY_REPORT: (projectId: string) =>
    `/api/v1/daily-reports/projects/${projectId}/weekly-report`,
  DAILY_REPORTS_BULK_APPROVE: "/api/v1/daily-reports/bulk-approve",
  DAILY_REPORTS_BULK_REJECT: "/api/v1/daily-reports/bulk-reject",
  DAILY_REPORTS_EXPORT_ENHANCED: "/api/v1/daily-reports/export-enhanced",
  DAILY_REPORTS_INSIGHTS: (projectId: string) =>
    `/api/v1/daily-reports/projects/${projectId}/insights`,
  DAILY_REPORTS_VALIDATE: "/api/v1/daily-reports/validate",
  DAILY_REPORTS_TEMPLATES: (projectId: string) =>
    `/api/v1/daily-reports/projects/${projectId}/templates`,
  DAILY_REPORTS_PENDING_APPROVAL: "/api/v1/daily-reports/pending-approval",
  DAILY_REPORTS_APPROVAL_HISTORY: (reportId: string) =>
    `/api/v1/daily-reports/${reportId}/approval-history`,

  // Weekly Reports
  WEEKLY_REPORTS: "/api/v1/weekly-reports",
  WEEKLY_REPORT_BY_ID: (reportId: string) =>
    `/api/v1/weekly-reports/${reportId}`,
  WEEKLY_REPORT_SUBMIT: (reportId: string) =>
    `/api/v1/weekly-reports/${reportId}/submit`,
  WEEKLY_REPORT_APPROVE: (reportId: string) =>
    `/api/v1/weekly-reports/${reportId}/approve`,

  // Calendar
  CALENDAR: "/api/v1/Calendar",
  CALENDAR_BY_ID: (id: string) => `/api/v1/Calendar/${id}`,
  CALENDAR_BY_PROJECT: (projectId: string) =>
    `/api/v1/Calendar/project/${projectId}`,
  CALENDAR_BY_TASK: (taskId: string) => `/api/v1/Calendar/task/${taskId}`,
  CALENDAR_BY_USER: (userId: string) => `/api/v1/Calendar/user/${userId}`,
  CALENDAR_UPCOMING: "/api/v1/Calendar/upcoming",
  CALENDAR_CONFLICTS: "/api/v1/Calendar/conflicts",
  CALENDAR_RECURRING: "/api/v1/Calendar/recurring",

  // Work Requests
  WORK_REQUESTS: "/api/v1/work-requests",
  WORK_REQUEST_BY_ID: (id: string) => `/api/v1/work-requests/${id}`,
  WORK_REQUEST_ASSIGN: (id: string, userId: string) =>
    `/api/v1/work-requests/${id}/assign/${userId}`,
  WORK_REQUEST_COMPLETE: (id: string) => `/api/v1/work-requests/${id}/complete`,
  WORK_REQUEST_SUBMIT_FOR_APPROVAL: (id: string) =>
    `/api/v1/work-requests/${id}/submit-for-approval`,
  WORK_REQUEST_PROCESS_APPROVAL: (id: string) =>
    `/api/v1/work-requests/${id}/process-approval`,
  WORK_REQUEST_APPROVAL_STATUS: (id: string) =>
    `/api/v1/work-requests/${id}/approval-status`,

  // Master Plans
  MASTER_PLANS: "/api/v1/master-plans",
  MASTER_PLAN_BY_ID: (id: string) => `/api/v1/master-plans/${id}`,
  MASTER_PLAN_BY_PROJECT: (projectId: string) =>
    `/api/v1/master-plans/project/${projectId}`,
  MASTER_PLAN_APPROVE: (id: string) => `/api/v1/master-plans/${id}/approve`,
  MASTER_PLAN_ACTIVATE: (id: string) => `/api/v1/master-plans/${id}/activate`,
  MASTER_PLAN_PROGRESS: (id: string) => `/api/v1/master-plans/${id}/progress`,
  MASTER_PLAN_COMPLETION: (id: string) =>
    `/api/v1/master-plans/${id}/completion`,
  MASTER_PLAN_PHASES: (id: string) => `/api/v1/master-plans/${id}/phases`,
  MASTER_PLAN_MILESTONES: (id: string) =>
    `/api/v1/master-plans/${id}/milestones`,
  MASTER_PLAN_GANTT_DATA: (id: string) =>
    `/api/v1/master-plans/${id}/gantt-data`,
  MASTER_PLAN_WEEKLY_VIEW: (id: string) =>
    `/api/v1/master-plans/${id}/weekly-view`,
  MASTER_PLAN_PROJECT: (masterPlanId: string) =>
    `/api/v1/master-plans/${masterPlanId}/project`,

  // Users
  USERS: "/api/v1/users",
  USER_BY_ID: (id: string) => `/api/v1/users/${id}`,
  USER_BY_USERNAME: (username: string) => `/api/v1/users/username/${username}`,
  USER_ACTIVATE: (id: string) => `/api/v1/users/${id}/activate`,
  USER_DEACTIVATE: (id: string) => `/api/v1/users/${id}/deactivate`,
  USERS_ADVANCED: "/api/v1/users/advanced",
  USERS_RICH: "/api/v1/users/rich",

  // Resources
  RESOURCES: "/api/v1/resources",
  RESOURCE_BY_ID: (resourceId: string) => `/api/v1/resources/${resourceId}`,

  // Images
  IMAGES_UPLOAD: "/api/v1/images/upload",
  IMAGES_BY_PROJECT: (projectId: string) =>
    `/api/v1/images/project/${projectId}`,
  IMAGES_BULK_UPLOAD: "/api/v1/images/bulk-upload",
  IMAGES_ADVANCED: (projectId: string) =>
    `/api/v1/images/project/${projectId}/advanced`,
  IMAGES_RICH: (projectId: string) =>
    `/api/v1/images/project/${projectId}/rich`,

  // Documents
  DOCUMENTS: "/api/v1/documents",
  DOCUMENT_BY_ID: (documentId: string) => `/api/v1/documents/${documentId}`,

  // Dashboard
  DASHBOARD_OVERVIEW: "/api/v1/dashboard/overview",
  DASHBOARD_PROJECT_PROGRESS: "/api/v1/dashboard/project-progress",
  DASHBOARD_LIVE_ACTIVITY: "/api/v1/dashboard/live-activity",
  DASHBOARD_STATISTICS: "/api/v1/dashboard/statistics",
  DASHBOARD_BROADCAST_PROGRESS: (projectId: string) =>
    `/api/v1/dashboard/broadcast-progress/${projectId}`,
  DASHBOARD_SYSTEM_ANNOUNCEMENT: "/api/v1/dashboard/system-announcement",

  // Notifications
  NOTIFICATIONS: "/api/v1/notifications",
  NOTIFICATION_BY_ID: (id: string) => `/api/v1/notifications/${id}`,
  NOTIFICATIONS_READ_ALL: "/api/v1/notifications/read-all",
  NOTIFICATIONS_TEST: "/api/v1/notifications/test",
  NOTIFICATIONS_STATISTICS: "/api/v1/notifications/statistics",
  NOTIFICATIONS_TEST_SIGNALR: "/api/v1/notifications/test-signalr",
  NOTIFICATIONS_SYSTEM_ANNOUNCEMENT:
    "/api/v1/notifications/system-announcement",
  NOTIFICATIONS_CONNECTION_INFO: "/api/v1/notifications/connection-info",

  // Debug endpoints
  DEBUG_CONFIG: "/api/Debug/config",
  DEBUG_CACHE_STATS: "/api/Debug/cache-stats",
  DEBUG_DATABASE: "/api/Debug/database",
} as const;

// Filter types
export interface FilterParameter {
  field?: string | null;
  operator?: string | null;
  value?: string | null;
}

// Calendar Event Types
export enum CalendarEventType {
  Meeting = 0,
  Task = 1,
  Milestone = 2,
  Reminder = 3,
  Inspection = 4,
  Maintenance = 5,
  Training = 6,
  Other = 7,
}

export enum CalendarEventStatus {
  Scheduled = 0,
  InProgress = 1,
  Completed = 2,
  Cancelled = 3,
  Postponed = 4,
}

export enum CalendarEventPriority {
  Low = 0,
  Normal = 1,
  High = 2,
  Critical = 3,
}

export interface CalendarEventDto {
  id: string;
  title?: string | null;
  description?: string | null;
  startDateTime: string;
  endDateTime: string;
  isAllDay: boolean;
  eventType: CalendarEventType;
  eventTypeName?: string | null;
  status: CalendarEventStatus;
  statusName?: string | null;
  priority: CalendarEventPriority;
  priorityName?: string | null;
  location?: string | null;
  projectId?: string | null;
  projectName?: string | null;
  taskId?: string | null;
  taskName?: string | null;
  createdByUserId: string;
  createdByUserName?: string | null;
  assignedToUserId?: string | null;
  assignedToUserName?: string | null;
  isRecurring?: boolean;
  recurrencePattern?: string | null;
  recurrenceEndDate?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

export interface CreateCalendarEventDto {
  title: string;
  description?: string | null;
  startDateTime: string;
  endDateTime: string;
  isAllDay?: boolean;
  eventType: CalendarEventType;
  status?: CalendarEventStatus;
  priority?: CalendarEventPriority;
  location?: string | null;
  projectId?: string | null;
  taskId?: string | null;
  assignedToUserId?: string | null;
  isRecurring?: boolean;
  recurrencePattern?: string | null;
  recurrenceEndDate?: string | null;
  notes?: string | null;
}

// Task Types
export interface TaskDto {
  taskId: string;
  projectId: string;
  projectName?: string | null;
  title?: string | null;
  description?: string | null;
  status?: string | null;
  dueDate?: string | null;
  assignedTechnician?: User;
  completionDate?: string | null;
  createdAt: string;
  updatedAt?: string | null;
  phaseId?: string | null;
  priority?: string | null;
  estimatedHours?: number | null;
  actualHours?: number | null;
  dependencies?: string[] | null;
  completionPercentage?: number;
}

export interface CreateTaskRequest {
  title: string;
  description?: string | null;
  dueDate?: string | null;
  assigneeId?: string | null;
  priority?: string | null;
  estimatedHours?: number | null;
  phaseId?: string | null;
  dependencies?: string[] | null;
}

export interface UpdateTaskRequest {
  title: string;
  description?: string | null;
  status: string;
  dueDate?: string | null;
  assigneeId?: string | null;
  priority?: string | null;
  estimatedHours?: number | null;
  actualHours?: number | null;
  completionPercentage?: number | null;
}

// Master Plan Types
export interface MasterPlanDto {
  id: string;
  title?: string | null;
  description?: string | null;
  projectId: string;
  startDate: string;
  endDate: string;
  status?: string | null;
  budget: number;
  priority?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt?: string | null;
  createdById: string;
  projectName?: string | null;
  createdByName?: string | null;
  approvedByName?: string | null;
}

export interface CreateMasterPlanRequest {
  projectId: string;
  name: string;
  title?: string | null;
  description?: string | null;
  plannedStartDate: string;
  startDate: string;
  plannedEndDate: string;
  endDate: string;
  budget?: number | null;
  phases?: CreateProjectPhaseRequest[] | null;
  milestones?: CreateProjectMilestoneRequest[] | null;
  status?: string | null;
}

export interface ProjectPhaseDto {
  id: string;
  name?: string | null;
  description?: string | null;
  startDate: string;
  endDate: string;
  status: PhaseStatus;
  completionPercentage: number;
  masterPlanId: string;
  tasksCompleted: number;
  totalTasks: number;
  actualDurationDays: number;
  isOnSchedule: boolean;
  isOnBudget: boolean;
  phaseId: string;
  phaseName?: string | null;
  plannedStartDate: string;
  plannedEndDate: string;
  actualStartDate?: string | null;
  actualEndDate?: string | null;
  weightPercentage: number;
  phaseOrder: number;
}

export enum PhaseStatus {
  NotStarted = 0,
  InProgress = 1,
  Completed = 2,
  OnHold = 3,
  Cancelled = 4,
  Delayed = 5,
}

export interface CreateProjectPhaseRequest {
  name?: string | null;
  description?: string | null;
  startDate: string;
  endDate: string;
  phaseOrder: number;
  weightPercentage: number;
  phaseName?: string | null;
  plannedStartDate: string;
  plannedEndDate: string;
}

export interface ProjectMilestoneDto {
  id: string;
  name?: string | null;
  description?: string | null;
  dueDate: string;
  completedDate?: string | null;
  status: string;
  masterPlanId: string;
  evidence?: string | null;
  phaseName?: string | null;
  verifiedByName?: string | null;
  daysFromPlanned: number;
  isOverdue: boolean;
}

export interface CreateProjectMilestoneRequest {
  name?: string | null;
  description?: string | null;
  dueDate: string;
  priority: MilestoneImportance;
  milestoneName?: string | null;
  targetDate: string;
}

export enum MilestoneImportance {
  Low = 0,
  Medium = 1,
  High = 2,
  Critical = 3,
}

// User Types
export interface User {
  userId: string;
  username?: string | null;
  email?: string | null;
  fullName?: string | null;
  role?: string | null;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string | null;
  profilePictureUrl?: string | null;
  phoneNumber?: string | null;
  department?: string | null;
  position?: string | null;
}

// Resource Types
export enum ResourceType {
  Material = 0,
  Equipment = 1,
  Labor = 2,
  Service = 3,
  Other = 4,
}

export enum ResourceStatus {
  Available = 0,
  Allocated = 1,
  InUse = 2,
  Maintenance = 3,
  OutOfService = 4,
  Ordered = 5,
  Delivered = 6,
}

export interface ResourceDto {
  id: string;
  name?: string | null;
  description?: string | null;
  type: ResourceType;
  status: ResourceStatus;
  quantity: number;
  unit?: string | null;
  unitCost: number;
  totalCost: number;
  projectId?: string | null;
  projectName?: string | null;
  supplierId?: string | null;
  supplierName?: string | null;
  orderDate?: string | null;
  deliveryDate?: string | null;
  location?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt?: string | null;
  createdBy?: User;
}

// Dashboard Types
export interface DashboardOverviewDto {
  projectSummary: ProjectSummaryDto;
  dailyReportSummary: DailyReportSummaryDto;
  workRequestSummary: WorkRequestSummaryDto;
  recentActivities?: RecentActivityDto[] | null;
  lastUpdated: string;
}

export interface ProjectSummaryDto {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  onHoldProjects: number;
}

export interface DailyReportSummaryDto {
  todayReports: number;
  pendingApproval: number;
  weeklyReports: number;
}

export interface WorkRequestSummaryDto {
  pendingRequests: number;
  inProgressRequests: number;
  completedRequests: number;
  urgentRequests: number;
}

export interface RecentActivityDto {
  id: string;
  type?: string | null;
  description?: string | null;
  timestamp: string;
  userId?: string | null;
  userName?: string | null;
  projectId?: string | null;
  projectName?: string | null;
}

// Work Request Types
export interface WorkRequestDto {
  workRequestId: string;
  projectId: string;
  projectName?: string | null;
  title?: string | null;
  description?: string | null;
  type?: string | null;
  priority?: string | null;
  status?: string | null;
  requestedById: string;
  requestedByName?: string | null;
  assignedToId?: string | null;
  assignedToName?: string | null;
  estimatedCost?: number | null;
  estimatedHours?: number | null;
  actualHours?: number | null;
  location?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt?: string | null;
  // ... additional approval fields
}

// Link helper type for API responses
export interface LinkDto {
  rel?: string | null;
  href?: string | null;
  method?: string | null;
}

// Notification Types
export interface NotificationDto {
  id: string;
  title?: string | null;
  message?: string | null;
  type?: string | null;
  isRead: boolean;
  createdAt: string;
  userId: string;
  relatedEntityId?: string | null;
  relatedEntityType?: string | null;
  actionUrl?: string | null;
}

// Image/Document Types
export interface ImageMetadataDto {
  imageId: string;
  projectId: string;
  taskId?: string | null;
  fileName?: string | null;
  originalFileName?: string | null;
  filePath?: string | null;
  fileSize: number;
  contentType?: string | null;
  uploadedAt: string;
  uploadedById: string;
  uploadedBy?: User;
  captureTimestamp?: string | null;
  gpsLatitude?: number | null;
  gpsLongitude?: number | null;
  deviceModel?: string | null;
  exifData?: string | null;
  description?: string | null;
  tags?: string[] | null;
}

export enum DocumentCategory {
  Contract = 0,
  Report = 1,
  Drawing = 2,
  Photo = 3,
  Certificate = 4,
  Other = 5,
}

export enum DocumentStatus {
  Draft = 0,
  Review = 1,
  Approved = 2,
  Archived = 3,
  Deleted = 4,
}

export interface DocumentDto {
  id: string;
  fileName?: string | null;
  originalFileName?: string | null;
  filePath?: string | null;
  fileSize: number;
  contentType?: string | null;
  projectId?: string | null;
  category: DocumentCategory;
  status: DocumentStatus;
  uploadedById: string;
  uploadedBy?: User;
  uploadedAt: string;
  description?: string | null;
  tags?: string | null;
  version: number;
  isLatestVersion: boolean;
}

// Weekly Report Types
export interface WeeklyReportDto {
  id: string;
  projectId: string;
  projectName?: string | null;
  weekStartDate: string;
  weekEndDate: string;
  status: string;
  submittedAt?: string | null;
  submittedBy?: User;
  approvedAt?: string | null;
  approvedBy?: User;
  rejectedAt?: string | null;
  rejectionReason?: string | null;
  overallProgress: number;
  weeklyAccomplishments?: string | null;
  issuesAndChallenges?: string | null;
  nextWeekPlans?: string | null;
  totalWorkHours: number;
  safetyIncidents: number;
  qualityMetrics?: string | null;
  createdAt: string;
  updatedAt?: string | null;
  dailyReports?: any[] | null; // DailyReportDto[] - avoiding circular import
  weeklyMilestones?: string[] | null;
}

export interface CreateWeeklyReportRequest {
  projectId: string;
  weekStartDate: string;
  weekEndDate: string;
  overallProgress: number;
  weeklyAccomplishments?: string | null;
  issuesAndChallenges?: string | null;
  nextWeekPlans?: string | null;
  totalWorkHours: number;
  safetyIncidents: number;
  qualityMetrics?: string | null;
  weeklyMilestones?: string[] | null;
}
