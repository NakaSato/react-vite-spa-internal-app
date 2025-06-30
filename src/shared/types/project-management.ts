// Enhanced Project Management Types based on Master Plan
// Implements the architectural blueprint from MASTER_PLAN_OF_PROJECT.md

export interface ProjectEntity {
  projectId: string;
  projectName: string;
  projectOwner: string; // e.g., PWA Phayao
  mainContractor: string; // e.g., PEA
  plannedStartDate: Date;
  plannedEndDate: Date;
  actualStartDate?: Date;
  actualEndDate?: Date;
  status: ProjectStatus;
  overallCompletion: number; // 0.0 to 1.0
  phases: Phase[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Phase {
  phaseId: string;
  projectId: string;
  phaseName: string; // Planning & Permitting, Procurement & Logistics, Construction & Installation, Testing & Handover
  weight: number; // e.g., 0.15 for 15%
  startDate: Date;
  endDate: Date;
  actualStartDate?: Date;
  actualEndDate?: Date;
  completion: number; // 0.0 to 1.0 calculated as weighted average of activities
  activities: Activity[];
  order: number;
}

export interface Activity {
  activityId: string;
  phaseId: string;
  activityName: string;
  duration: number; // in days
  startDate: Date;
  endDate: Date;
  actualStartDate?: Date;
  actualEndDate?: Date;
  percentComplete: number; // 0.0 to 1.0
  weight?: number; // If not provided, duration is used as weight
  assignedResources: string[];
  dependencies: TaskDependency[];
  documents: Document[];
  isOnCriticalPath: boolean;
  status: ActivityStatus;
  notes?: string;
}

export interface TaskDependency {
  dependencyId: string;
  predecessorId: string;
  successorId: string;
  dependencyType: DependencyType;
  lagTime: number; // in days, can be negative for lead time
}

export interface Resource {
  resourceId: string;
  resourceName: string;
  resourceType: ResourceType;
  availability: number; // 0.0 to 1.0
  cost?: number; // cost per day
  skills?: string[];
  isActive: boolean;
}

export interface Document {
  documentId: string;
  activityId: string;
  documentName: string;
  fileName: string;
  version: number;
  uploadDate: Date;
  uploaderId: string;
  fileSize: number;
  fileType: string;
  url?: string;
  description?: string;
}

export interface Notification {
  notificationId: string;
  projectId: string;
  activityId?: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  readAt?: Date;
  priority: NotificationPriority;
}

// Enums
export enum ProjectStatus {
  PLANNING = "planning",
  IN_PROGRESS = "in_progress",
  ON_HOLD = "on_hold",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export enum ActivityStatus {
  NOT_STARTED = "not_started",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  BLOCKED = "blocked",
  OVERDUE = "overdue",
}

export enum DependencyType {
  FINISH_TO_START = 1, // FS
  START_TO_START = 2, // SS
  FINISH_TO_FINISH = 3, // FF
  START_TO_FINISH = 4, // SF
}

export enum ResourceType {
  TEAM = "team",
  EQUIPMENT = "equipment",
  MATERIAL = "material",
  SPECIALIST = "specialist",
}

export enum NotificationType {
  DEADLINE_APPROACHING = "deadline_approaching",
  TASK_OVERDUE = "task_overdue",
  RESOURCE_CONFLICT = "resource_conflict",
  DEPENDENCY_ISSUE = "dependency_issue",
  PROGRESS_UPDATE = "progress_update",
  DOCUMENT_UPLOADED = "document_uploaded",
  STATUS_CHANGE = "status_change",
}

export enum NotificationPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

// Progress Calculation Types
export interface ProgressCalculation {
  projectId: string;
  overallCompletion: number;
  phaseCompletions: PhaseCompletion[];
  calculatedAt: Date;
  criticalPath: string[]; // Array of activity IDs on critical path
  projectHealth: ProjectHealth;
}

export interface PhaseCompletion {
  phaseId: string;
  phaseName: string;
  completion: number;
  weight: number;
  contributionToOverall: number;
  onSchedule: boolean;
  daysAhead: number; // negative if behind
}

export interface ProjectHealth {
  status: "healthy" | "at_risk" | "critical";
  riskFactors: string[];
  recommendations: string[];
  scheduleVariance: number; // percentage
  budgetVariance?: number; // percentage
}

// Gantt Chart Types
export interface GanttTask {
  id: string;
  name: string;
  start: Date;
  end: Date;
  progress: number;
  type: "project" | "phase" | "activity";
  parent?: string;
  dependencies?: string[];
  resources?: string[];
  isOnCriticalPath: boolean;
  baseline?: {
    start: Date;
    end: Date;
  };
}

export interface GanttData {
  tasks: GanttTask[];
  resources: Resource[];
  dependencies: TaskDependency[];
  timeline: {
    start: Date;
    end: Date;
  };
}

// API Response Types
export interface ProjectListResponse {
  projects: ProjectEntity[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ProjectDetailResponse {
  project: ProjectEntity;
  ganttData: GanttData;
  progressCalculation: ProgressCalculation;
}

export interface CreateProjectRequest {
  projectName: string;
  projectOwner: string;
  mainContractor: string;
  plannedStartDate: Date;
  plannedEndDate: Date;
  phases: CreatePhaseRequest[];
}

export interface CreatePhaseRequest {
  phaseName: string;
  weight: number;
  startDate: Date;
  endDate: Date;
  activities: CreateActivityRequest[];
}

export interface CreateActivityRequest {
  activityName: string;
  duration: number;
  startDate: Date;
  endDate: Date;
  assignedResources?: string[];
}

export interface UpdateProgressRequest {
  activityId: string;
  percentComplete: number;
  notes?: string;
  actualStartDate?: Date;
  actualEndDate?: Date;
}

// Master Project Template (from Master Plan)
export interface SolarProjectTemplate {
  phases: {
    planning: {
      name: "Planning & Permitting";
      weight: 0.15;
      activities: string[];
    };
    procurement: {
      name: "Procurement & Logistics";
      weight: 0.1;
      activities: string[];
    };
    construction: {
      name: "Construction & Installation";
      weight: 0.65;
      activities: string[];
    };
    testing: {
      name: "Testing & Handover";
      weight: 0.1;
      activities: string[];
    };
  };
}

// Solar Project Specific Types
export interface SolarProjectDetails {
  systemCapacityKw: number;
  pvModuleCount: number;
  inverterConfiguration: {
    inverter125Kw: number;
    inverter80Kw: number;
    inverter60Kw: number;
    inverter40Kw: number;
  };
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  connectionType: "LV" | "MV" | "HV";
  estimatedProduction: number; // kWh/year
  budgetDetails: {
    totalBudget: number;
    spent: number;
    remaining: number;
    variance: number;
  };
}

export interface WeatherData {
  date: Date;
  temperature: number;
  humidity: number;
  solarIrradiance: number;
  windSpeed: number;
  precipitation: number;
}

export interface ConstructionLog {
  logId: string;
  activityId: string;
  date: Date;
  workDescription: string;
  workersCount: number;
  hoursWorked: number;
  materialsUsed: string[];
  equipmentUsed: string[];
  weatherConditions: WeatherData;
  photos: string[];
  issues: string[];
  completedTasks: string[];
  nextDayPlan: string[];
  supervisorId: string;
  approved: boolean;
}
