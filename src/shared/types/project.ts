import { User } from "./auth";

// Tab Type for Dashboard Navigation
export type TabType =
  | "overview"
  | "projects"
  | "construction"
  | "reports"
  | "masterplan"
  | "management";

// Project Status Enum
export enum ProjectStatus {
  PLANNING = "Planning",
  IN_PROGRESS = "InProgress",
  ON_HOLD = "OnHold",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled",
}

// Connection Type Enum
export enum ConnectionType {
  LV = "LV", // Low Voltage
  MV = "MV", // Medium Voltage
  HV = "HV", // High Voltage
}

// Legacy Project interface for mock data and components (compatibility)
export interface Project {
  id: string;
  name: string;
  client: string;
  clientName?: string;
  status: string;
  progress: number;
  startDate: string;
  expectedCompletion: string;
  systemSize: string;
  location: string;
  priority: string;
  assignedTeam: string[];
  budget: number;
  spent: number;
}

// Project types based on your API schema
export interface ProjectDto {
  projectId: string;
  projectName: string | null;
  address: string | null;
  clientInfo: string | null;
  status: string | null;
  startDate: string;
  estimatedEndDate: string | null;
  actualEndDate: string | null;
  updatedAt: string | null;
  projectManager: User;
  taskCount: number;
  completedTaskCount: number;
  team: string | null;
  connectionType: string | null;
  connectionNotes: string | null;
  totalCapacityKw: number | null;
  pvModuleCount: number | null;
  equipmentDetails: EquipmentDetailsDto;
  ftsValue: number | null;
  revenueValue: number | null;
  pqmValue: number | null;
  locationCoordinates: LocationCoordinatesDto;
  createdAt: string;
}

// Enhanced Equipment Details matching API documentation
export interface EquipmentDetailsDto {
  inverter125kw: number;
  inverter80kw: number;
  inverter60kw: number;
  inverter40kw: number;
}

export interface LocationCoordinatesDto {
  latitude: number;
  longitude: number;
}

export interface CreateProjectRequest {
  projectName: string;
  address: string;
  clientInfo?: string | null;
  startDate: string;
  estimatedEndDate?: string | null;
  projectManagerId: string;
  team?: string | null;
  connectionType?: string | null;
  connectionNotes?: string | null;
  totalCapacityKw?: number | null;
  pvModuleCount?: number | null;
  ftsValue?: number | null;
  revenueValue?: number | null;
  pqmValue?: number | null;
  inverter125Kw?: number | null;
  inverter80Kw?: number | null;
  inverter60Kw?: number | null;
  inverter40Kw?: number | null;
  latitude?: number | null;
  longitude?: number | null;
  supplierId?: string | null;
  orderDate?: string | null;
  deliveryDate?: string | null;
}

export interface UpdateProjectRequest {
  projectName: string;
  address: string;
  clientInfo?: string | null;
  status: "Planning" | "InProgress" | "Completed" | "OnHold" | "Cancelled";
  startDate: string;
  estimatedEndDate?: string | null;
  actualEndDate?: string | null;
  projectManagerId: string;
}

export interface PatchProjectRequest {
  projectName?: string | null;
  address?: string | null;
  clientInfo?: string | null;
  status?:
    | "Planning"
    | "InProgress"
    | "Completed"
    | "OnHold"
    | "Cancelled"
    | null;
  startDate?: string | null;
  estimatedEndDate?: string | null;
  actualEndDate?: string | null;
  projectManagerId?: string | null;
}

// Enhanced Project Status Response
export interface ProjectStatusDto {
  projectId: string;
  projectName: string;
  status: string;
  plannedStartDate: string;
  plannedEndDate: string | null;
  actualStartDate: string | null;
  overallCompletionPercentage: number;
  isOnSchedule: boolean;
  isOnBudget: boolean;
  activeTasks: number;
  completedTasks: number;
  totalTasks: number;
  lastUpdated: string;
  links: ProjectLink[];
}

export interface ProjectLink {
  href: string;
  rel: string;
  method: string;
}

// Project Analytics Types
export interface ProjectAnalyticsDto {
  summary: ProjectAnalyticsSummary;
  statusBreakdown: Record<string, number>;
  performanceMetrics: ProjectPerformanceMetrics;
  trends: ProjectTrends;
  topPerformers: TopPerformers;
}

export interface ProjectAnalyticsSummary {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalCapacity: number;
  averageCompletionTime: number;
  onTimeDeliveryRate: number;
}

export interface ProjectPerformanceMetrics {
  averageProjectDuration: number;
  budgetVariance: number;
  qualityScore: number;
  customerSatisfaction: number;
  teamEfficiency: number;
}

export interface ProjectTrends {
  projectsPerMonth: MonthlyProjectData[];
  capacityTrends: MonthlyCapacityData[];
}

export interface MonthlyProjectData {
  month: string;
  count: number;
  completed: number;
}

export interface MonthlyCapacityData {
  month: string;
  totalKw: number;
}

export interface TopPerformers {
  managers: TopManagerDto[];
  projects: TopProjectDto[];
}

export interface TopManagerDto {
  managerId: string;
  fullName: string;
  projectCount: number;
  completionRate: number;
  averageDuration: number;
}

export interface TopProjectDto {
  projectId: string;
  projectName: string;
  completionRate: number;
  onTimeDelivery: boolean;
  budgetVariance: number;
}

// Project Performance Tracking
export interface ProjectPerformanceDto {
  projectId: string;
  projectName: string;
  performanceScore: number;
  kpis: ProjectKPIs;
  milestones: ProjectMilestone[];
  resourceUtilization: ResourceUtilization;
  riskAssessment: RiskAssessment;
  progressHistory: ProgressHistoryEntry[];
}

export interface ProjectKPIs {
  timelineAdherence: number;
  budgetAdherence: number;
  qualityScore: number;
  safetyScore: number;
  clientSatisfaction: number;
}

export interface ProjectMilestone {
  milestoneId: string;
  title: string;
  targetDate: string;
  actualDate: string | null;
  status: string;
  varianceDays: number;
}

export interface ResourceUtilization {
  teamUtilization: number;
  equipmentUtilization: number;
  materialEfficiency: number;
}

export interface RiskAssessment {
  overallRiskLevel: string;
  activeRisks: number;
  mitigatedRisks: number;
  riskTrend: string;
}

export interface ProgressHistoryEntry {
  date: string;
  completionPercentage: number;
  tasksCompleted: number;
  hoursWorked: number;
  issues: number;
}

// Project Templates
export interface ProjectTemplateDto {
  templateId: string;
  name: string;
  description: string;
  category: string;
  estimatedDuration: number;
  defaultTasks: TemplateTask[];
  requiredEquipment: string[];
  usageCount: number;
}

export interface TemplateTask {
  title: string;
  estimatedHours: number;
  phase: string;
}

export interface CreateProjectFromTemplateRequest {
  projectName: string;
  address: string;
  clientInfo: string;
  totalCapacityKw: number;
  projectManagerId: string;
  startDate: string;
  customizations?: ProjectCustomizations;
}

export interface ProjectCustomizations {
  skipTasks?: string[];
  additionalTasks?: TemplateTask[];
}

// Project Status Update
export interface UpdateProjectStatusRequest {
  status: string;
  reason: string;
  effectiveDate: string;
  notifyStakeholders: boolean;
}

export interface ProjectStatusUpdateResponse {
  projectId: string;
  previousStatus: string;
  newStatus: string;
  effectiveDate: string;
  updatedBy: {
    userId: string;
    fullName: string;
  };
  notifications: {
    sent: number;
    failed: number;
    recipients: string[];
  };
}

// Advanced Search Types
export interface ProjectSearchRequest {
  q?: string;
  filters?: ProjectSearchFilters;
  coordinates?: string; // "lat,lng,radius"
  dateRange?: string;
  facets?: boolean;
  pageNumber?: number;
  pageSize?: number;
}

export interface ProjectSearchFilters {
  status?: string[];
  capacity?: {
    min?: number;
    max?: number;
  };
  location?: string[];
  managerId?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface ProjectSearchResponse {
  query: string;
  results: ProjectSearchResult[];
  facets: ProjectSearchFacets;
  suggestions: string[];
  totalResults: number;
  searchTime: number;
}

export interface ProjectSearchResult {
  projectId: string;
  projectName: string;
  relevanceScore: number;
  matchedFields: string[];
  highlights: string[];
}

export interface ProjectSearchFacets {
  status: Record<string, number>;
  capacity: Record<string, number>;
  location: Record<string, number>;
}

// Query Parameters for Get All Projects
export interface GetProjectsParams {
  pageNumber?: number;
  pageSize?: number;
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  fields?: string;
  managerId?: string;
}

// Analytics Query Parameters
export interface ProjectAnalyticsParams {
  timeframe?: "30d" | "90d" | "1y" | "all";
  groupBy?: "status" | "manager" | "month" | "quarter";
  includeFinancial?: boolean;
  includePerformance?: boolean;
}

// Real-time update types for SignalR/WebSocket integration
export interface ProjectUpdateNotification {
  type:
    | "PROJECT_CREATED"
    | "PROJECT_UPDATED"
    | "PROJECT_DELETED"
    | "PROJECT_STATUS_CHANGED";
  projectId: string;
  projectName: string;
  updatedBy: {
    userId: string;
    fullName: string;
  };
  timestamp: string;
  changes?: Record<string, any>;
  previousValues?: Record<string, any>;
}

export interface RealTimeProjectUpdate {
  projectId: string;
  updateType: "created" | "updated" | "deleted" | "status_changed";
  data: Partial<ProjectDto>;
  metadata: {
    updatedBy: string;
    timestamp: string;
    changeDescription?: string;
  };
}

// Enhanced project status workflow
export interface ProjectStatusWorkflow {
  currentStatus: ProjectStatus;
  allowedTransitions: ProjectStatus[];
  requiresApproval: boolean;
  approvalLevel?: "manager" | "admin";
  statusHistory: ProjectStatusHistoryEntry[];
}

export interface ProjectStatusHistoryEntry {
  status: ProjectStatus;
  changedAt: string;
  changedBy: {
    userId: string;
    fullName: string;
  };
  reason?: string;
  duration?: number; // days in this status
}

// Enhanced project creation with full equipment details
export interface EnhancedCreateProjectRequest {
  projectName: string;
  address: string;
  clientInfo?: string;
  startDate: string;
  estimatedEndDate?: string;
  projectManagerId: string;
  team?: string;
  connectionType?: ConnectionType;
  connectionNotes?: string;
  totalCapacityKw?: number;
  pvModuleCount?: number;
  equipmentDetails?: EquipmentDetailsDto;
  ftsValue?: number;
  revenueValue?: number;
  pqmValue?: number;
  locationCoordinates?: LocationCoordinatesDto;
}

// Enhanced project update with full equipment details
export interface EnhancedUpdateProjectRequest {
  projectName?: string;
  address?: string;
  clientInfo?: string;
  status?: ProjectStatus;
  startDate?: string;
  estimatedEndDate?: string;
  actualEndDate?: string;
  projectManagerId?: string;
  team?: string;
  connectionType?: ConnectionType;
  connectionNotes?: string;
  totalCapacityKw?: number;
  pvModuleCount?: number;
  equipmentDetails?: EquipmentDetailsDto;
  ftsValue?: number;
  revenueValue?: number;
  pqmValue?: number;
  locationCoordinates?: LocationCoordinatesDto;
}

// Project notification preferences
export interface ProjectNotificationSettings {
  statusChanges: boolean;
  milestoneUpdates: boolean;
  teamAssignments: boolean;
  documentUploads: boolean;
  reportSubmissions: boolean;
  realTimeUpdates: boolean;
}

// Project error types for better error handling
export interface ProjectError {
  code: string;
  message: string;
  field?: string;
  details?: Record<string, any>;
}

// Project validation result
export interface ProjectValidationResult {
  isValid: boolean;
  errors: ProjectError[];
  warnings: ProjectError[];
}

// Bulk operations for projects
export interface BulkProjectOperation {
  operation: "update_status" | "assign_manager" | "update_team" | "delete";
  projectIds: string[];
  data: Record<string, any>;
}

export interface BulkProjectOperationResult {
  successful: string[];
  failed: Array<{
    projectId: string;
    error: string;
  }>;
  summary: {
    total: number;
    successful: number;
    failed: number;
  };
}

// ============================================================================
// DAILY REPORTS TYPES
// ============================================================================

// Daily Report Status Enum
export enum DailyReportApprovalStatus {
  DRAFT = "Draft",
  SUBMITTED = "Submitted",
  APPROVED = "Approved",
  REJECTED = "Rejected",
  REVISION_REQUIRED = "RevisionRequired",
}

// Weather Conditions Enum
export enum WeatherCondition {
  SUNNY = "Sunny",
  PARTLY_CLOUDY = "PartlyCloudy",
  CLOUDY = "Cloudy",
  RAINY = "Rainy",
  STORMY = "Stormy",
  SNOWY = "Snowy",
  WINDY = "Windy",
  FOGGY = "Foggy",
}

// Daily Report Core Interface
export interface DailyReportDto {
  id: string;
  projectId: string;
  projectName: string;
  userId: string;
  userName: string;
  reportDate: string;
  approvalStatus: DailyReportApprovalStatus;
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  hoursWorked: number;
  personnelOnSite: number;
  weatherConditions: string;
  temperature?: number;
  humidity?: number;
  windSpeed?: number;
  weatherImpact?: string;
  summary: string;
  workAccomplished?: string;
  workPlannedNextDay?: string;
  issues?: string;
  safetyScore: number;
  qualityScore: number;
  dailyProgressContribution: number;
  hasCriticalIssues: boolean;
  requiresManagerAttention: boolean;
  additionalNotes?: string;
  tasksCompleted: DailyReportTaskProgress[];
  materialsUsed: DailyReportMaterialUsage[];
  attachments: DailyReportAttachment[];
  createdAt: string;
  updatedAt?: string;
  hasAttachments: boolean;
  canEdit: boolean;
  canSubmit: boolean;
}

// Daily Report Task Progress
export interface DailyReportTaskProgress {
  taskId: string;
  title?: string;
  completionPercentage: number;
  startPercentage?: number;
  endPercentage?: number;
  progressMade?: number;
  status?: string;
  isOnSchedule?: boolean;
  notes?: string;
}

// Daily Report Material Usage
export interface DailyReportMaterialUsage {
  materialId?: string;
  name: string;
  quantity: number;
  unit: string;
  unitCost?: number;
  totalCost?: number;
  notes?: string;
}

// Daily Report Attachment
export interface DailyReportAttachment {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  category?: string;
  uploadedAt: string;
  thumbnailUrl?: string;
}

// Work Progress Item
export interface WorkProgressItem {
  activity: string;
  description: string;
  hoursWorked: number;
  percentageComplete: number;
  workersAssigned: number;
  notes?: string;
}

// Personnel Log
export interface PersonnelLog {
  userId: string;
  name?: string;
  hoursWorked: number;
  role: string;
  specialAssignments?: string;
  notes?: string;
}

// Equipment Log
export interface EquipmentLog {
  equipmentId: string;
  hoursUsed: number;
  condition: string;
  issues?: string;
  maintenanceNotes?: string;
}

// Create Daily Report Request
export interface CreateDailyReportRequest {
  projectId: string;
  reportDate: string;
  hoursWorked: number;
  personnelOnSite: number;
  weatherConditions: string;
  temperature?: number;
  humidity?: number;
  windSpeed?: number;
  weatherImpact?: string;
  summary: string;
  workAccomplished?: string;
  workPlannedNextDay?: string;
  issues?: string;
  safetyScore: number;
  qualityScore: number;
  dailyProgressContribution: number;
  additionalNotes?: string;
  tasksCompleted?: DailyReportTaskProgress[];
  materialsUsed?: DailyReportMaterialUsage[];
}

// Enhanced Create Daily Report Request
export interface CreateEnhancedDailyReportRequest
  extends CreateDailyReportRequest {
  weatherCondition: WeatherCondition;
  weatherDescription?: string;
  workProgressItems?: WorkProgressItem[];
  personnelLogs?: PersonnelLog[];
  equipmentLogs?: EquipmentLog[];
}

// Update Daily Report Request
export interface UpdateDailyReportRequest {
  hoursWorked?: number;
  personnelOnSite?: number;
  weatherConditions?: string;
  temperature?: number;
  humidity?: number;
  windSpeed?: number;
  weatherImpact?: string;
  summary?: string;
  workAccomplished?: string;
  workPlannedNextDay?: string;
  issues?: string;
  safetyScore?: number;
  qualityScore?: number;
  dailyProgressContribution?: number;
  additionalNotes?: string;
  tasksCompleted?: DailyReportTaskProgress[];
  materialsUsed?: DailyReportMaterialUsage[];
}

// Daily Report Query Parameters
export interface GetDailyReportsParams {
  projectId?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
  approvalStatus?: DailyReportApprovalStatus;
  minSafetyScore?: number;
  minQualityScore?: number;
  weatherCondition?: WeatherCondition;
  hasCriticalIssues?: boolean;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  pageNumber?: number;
  pageSize?: number;
}

// Daily Report Summary
export interface DailyReportSummary {
  totalReports: number;
  averageSafetyScore: number;
  averageQualityScore: number;
  totalHoursLogged: number;
  totalProgressContribution: number;
  criticalIssuesCount: number;
  pendingApprovals: number;
}

// Daily Report Analytics
export interface DailyReportAnalytics {
  projectId: string;
  projectName: string;
  analysisPeriodStart: string;
  analysisPeriodEnd: string;
  totalReports: number;
  totalHoursLogged: number;
  averageHoursPerDay: number;
  averageSafetyScore: number;
  averageQualityScore: number;
  totalProgressContribution: number;
  averageProgressPerDay: number;
  daysAheadBehindSchedule: number;
  totalCriticalIssues: number;
  weatherDelayDays: number;
  topIssueCategories: string[];
  averageTeamSize: number;
  productivityIndex: number;
  topPerformers: TopPerformer[];
  weatherConditionDays: Record<string, number>;
  weatherImpactScore: number;
  progressTrend: TrendDataPoint[];
  safetyTrend: TrendDataPoint[];
}

// Top Performer
export interface TopPerformer {
  userId: string;
  name: string;
  reportsSubmitted: number;
  averageHoursPerDay: number;
  averageSafetyScore: number;
  averageQualityScore: number;
  productivityScore: number;
}

// Trend Data Point
export interface TrendDataPoint {
  date: string;
  value: number;
}

// Weekly Progress Report
export interface WeeklyProgressReport {
  projectId: string;
  projectName: string;
  weekStartDate: string;
  weekEndDate: string;
  reportsSubmitted: number;
  totalHours: number;
  progressMade: number;
  teamMemberCount: number;
  dailyProgress: DailyProgressSummary[];
  keyAccomplishments: string[];
  criticalIssues: string[];
  upcomingMilestones: string[];
  averageSafetyScore: number;
  averageQualityScore: number;
  isOnSchedule: boolean;
  productivityIndex: number;
}

// Daily Progress Summary
export interface DailyProgressSummary {
  date: string;
  hours: number;
  progress: number;
  teamSize: number;
  weatherCondition: string;
  hasIssues: boolean;
  safetyScore: number;
  qualityScore: number;
}

// Daily Report Insights
export interface DailyReportInsights {
  projectId: string;
  projectName: string;
  generatedAt: string;
  performanceInsights: string[];
  productivityRecommendations: string[];
  riskLevel: "Low" | "Medium" | "High";
  identifiedRisks: string[];
  riskMitigationSuggestions: string[];
  isOnTrack: boolean;
  progressVelocity: number;
  estimatedDaysToCompletion: number;
  safetyRecommendations: string[];
  qualityImprovements: string[];
  trends: InsightTrend[];
}

// Insight Trend
export interface InsightTrend {
  category: string;
  trend: "Improving" | "Stable" | "Declining";
  description: string;
  changePercent: number;
  recommendation: string;
}

// Daily Report Validation Result
export interface DailyReportValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  suggestions: string[];
  ruleResults: ValidationRuleResult[];
  autoCorrections: AutoCorrection[];
}

// Validation Error
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

// Validation Rule Result
export interface ValidationRuleResult {
  ruleName: string;
  severity: "Error" | "Warning" | "Info";
  passed: boolean;
  message: string;
  suggestion?: string;
}

// Auto Correction
export interface AutoCorrection {
  field: string;
  currentValue: any;
  suggestedValue: any;
  reason: string;
  confidence: number;
}

// Approval History Entry
export interface ApprovalHistoryEntry {
  id: string;
  action: "Submitted" | "Approved" | "Rejected" | "RevisionRequired";
  actorId: string;
  actorName: string;
  timestamp: string;
  comments?: string;
}

// Bulk Approval/Rejection Request
export interface BulkApprovalRequest {
  reportIds: string[];
  comments?: string;
}

export interface BulkRejectionRequest {
  reportIds: string[];
  rejectionReason: string;
}

// Bulk Operation Result
export interface BulkOperationResult {
  totalRequested: number;
  successCount: number;
  failureCount: number;
  results: BulkOperationItemResult[];
  summary: string;
}

export interface BulkOperationItemResult {
  itemId: string;
  success: boolean;
  details: string;
}

// Daily Report Template
export interface DailyReportTemplate {
  id: string;
  name: string;
  description: string;
  projectId: string;
  projectType: string;
  fields: TemplateField[];
  requiredFields: string[];
  defaultValues: Record<string, any>;
  validationRules: TemplateValidationRule[];
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
}

// Template Field
export interface TemplateField {
  name: string;
  label: string;
  type: "Text" | "Number" | "Date" | "Select" | "TextArea" | "Checkbox";
  isRequired: boolean;
  helpText?: string;
  displayOrder: number;
  constraints?: FieldConstraints;
  defaultValue?: any;
  options?: string[];
}

// Field Constraints
export interface FieldConstraints {
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}

// Template Validation Rule
export interface TemplateValidationRule {
  name: string;
  type: "Range" | "Required" | "Pattern" | "Custom";
  field: string;
  parameters: Record<string, any>;
  errorMessage: string;
  severity: "Error" | "Warning" | "Info";
}

// Export Request
export interface DailyReportExportRequest {
  projectId?: string;
  startDate: string;
  endDate: string;
  format: "csv" | "excel" | "pdf" | "json";
  includeAttachments?: boolean;
  includeAnalytics?: boolean;
  fieldsToInclude?: string[];
}

// Real-time Daily Report Update Notification
export interface DailyReportUpdateNotification {
  type:
    | "DAILY_REPORT_CREATED"
    | "DAILY_REPORT_UPDATED"
    | "DAILY_REPORT_APPROVED"
    | "DAILY_REPORT_REJECTED"
    | "DAILY_REPORT_SUBMITTED";
  reportId: string;
  projectId: string;
  projectName: string;
  reportDate: string;
  updatedBy: {
    userId: string;
    fullName: string;
  };
  timestamp: string;
  changes?: Record<string, any>;
  previousStatus?: DailyReportApprovalStatus;
  newStatus?: DailyReportApprovalStatus;
}

// ============================================================================
// BACKWARD COMPATIBILITY TYPE ALIASES
// ============================================================================

/**
 * Legacy type alias - now using the Project interface defined above for backward compatibility
 * @deprecated Use ProjectDto instead for new code
 */
// export type Project = ProjectDto; // Commented out to use interface above

/**
 * Legacy type alias for CreateProjectRequest
 * @deprecated Use CreateProjectRequest instead
 */
export type NewProjectForm = CreateProjectRequest;

/**
 * Legacy type alias for UpdateProjectRequest
 * @deprecated Use UpdateProjectRequest instead
 */
export type UpdateProjectForm = UpdateProjectRequest;
