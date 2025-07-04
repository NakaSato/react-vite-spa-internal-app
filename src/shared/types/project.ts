import { User } from "./auth";

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

export interface EquipmentDetailsDto {
  inverter125Kw: number | null;
  inverter80Kw: number | null;
  inverter60Kw: number | null;
  inverter40Kw: number | null;
  totalInverters: number;
  totalInverterCapacity: number;
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

export interface ProjectStatusDto {
  projectId: string;
  projectName: string | null;
  status: string | null;
  plannedStartDate: string | null;
  plannedEndDate: string | null;
  actualStartDate: string | null;
  actualEndDate: string | null;
  overallCompletionPercentage: number;
  isOnSchedule: boolean;
  isOnBudget: boolean;
  activeTasks: number;
  completedTasks: number;
  totalTasks: number;
  lastUpdated: string;
  links: LinkDto[] | null;
}

export interface LinkDto {
  rel: string | null;
  href: string | null;
  method: string | null;
}

export interface ProjectProgressDto {
  projectId: string;
  projectName: string | null;
  completionPercentage: number;
  progressPercentage: number;
  status: string | null;
  startDate: string;
  endDate: string | null;
  estimatedEndDate: string | null;
  actualEndDate: string | null;
  projectManager: string | null;
  tasksCompleted: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  lastUpdated: string;
}

// Task types
export interface TaskDto {
  taskId: string;
  projectId: string;
  projectName: string | null;
  title: string | null;
  description: string | null;
  status: string | null;
  dueDate: string | null;
  assignedTechnician: User;
  completionDate: string | null;
  createdAt: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string | null;
  dueDate?: string | null;
  assignedTechnicianId?: string | null;
}

export interface UpdateTaskRequest {
  title: string;
  description?: string | null;
  status: "Pending" | "In Progress" | "Completed" | "Cancelled";
  dueDate?: string | null;
  assignedTechnicianId?: string | null;
}

export interface PatchTaskRequest {
  title?: string | null;
  description?: string | null;
  status?: "Pending" | "In Progress" | "Completed" | "Cancelled" | null;
  dueDate?: string | null;
  assignedTechnicianId?: string | null;
}

// Legacy compatibility types
export interface Project {
  id: string;
  name: string;
  client: string;
  status:
    | "Planning"
    | "Design"
    | "Permits"
    | "Construction"
    | "Inspection"
    | "Completed";
  progress: number;
  startDate: string;
  expectedCompletion: string;
  systemSize: string;
  location: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  assignedTeam: string[];
  budget: number;
  spent: number;
}

export interface NewProjectForm {
  projectName: string;
  address: string;
  clientInfo: string;
  status: ProjectDto["status"];
  startDate: string;
  estimatedEndDate: string;
  totalCapacityKw: number;
  pvModuleCount: number;
  ftsValue: number;
  revenueValue: number;
  pqmValue: number;
  inverter125Kw: number;
  inverter80Kw: number;
  inverter60Kw: number;
  inverter40Kw: number;
  latitude: number;
  longitude: number;
  connectionType: "LV" | "MV" | "HV";
  connectionNotes: string;
}

export type TabType =
  | "overview"
  | "projects"
  | "construction"
  | "reports"
  | "masterplan"
  | "management";
