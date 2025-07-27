// Task-specific types for Project Schedule Management
export interface TaskFilters {
  status?: string;
  assigneeId?: string;
  dueDateAfter?: string;
  dueDateBefore?: string;
  search?: string;
  pageNumber: number;
  pageSize: number;
}

export interface TaskDependency {
  predecessorId: string;
  successorId: string;
  type:
    | "finish_to_start"
    | "start_to_start"
    | "finish_to_finish"
    | "start_to_finish";
  lag: number; // in days
}

export interface CreateTaskRequest {
  name: string;
  description?: string;
  assigneeId?: string;
  dueDate: string;
  priority: "low" | "medium" | "high" | "critical";
  dependencies?: TaskDependency[];
  estimatedHours?: number;
  projectId?: string;
}

export interface UpdateTaskRequest {
  name?: string;
  description?: string;
  status?: "pending" | "in_progress" | "completed" | "blocked" | "cancelled";
  assigneeId?: string;
  dueDate?: string;
  priority?: "low" | "medium" | "high" | "critical";
  progress?: number;
  notes?: string;
}

export interface TaskDto {
  taskId: string;
  name: string;
  description?: string;
  status: string;
  assigneeId?: string;
  assigneeName?: string;
  projectId: string;
  dueDate: string;
  priority: string;
  progress: number;
  estimatedHours?: number;
  actualHours?: number;
  dependencies: TaskDependency[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}
