// Schedule-specific types for Project Schedule Management
import { ProjectEntity } from "./project-management";

export interface ProjectSchedule {
  project: ProjectEntity;
  timeline: {
    start: Date;
    end: Date;
    totalDays: number;
  };
  milestones: Milestone[];
  health: ScheduleHealth;
}

export interface ScheduleHealth {
  status: "healthy" | "at_risk" | "critical";
  scheduleVariance: number;
  criticalPathStatus: "on_track" | "delayed" | "blocked";
  riskFactors: string[];
  recommendations: string[];
}

export interface Milestone {
  id: string;
  name: string;
  date: Date;
  status: "pending" | "completed" | "overdue";
  dependencies: string[];
}

export interface GanttData {
  timeline: {
    start: Date;
    end: Date;
    totalDays: number;
  };
  tasks: GanttTask[];
  milestones: Milestone[];
}

export interface GanttTask {
  id: string;
  name: string;
  start: Date;
  end: Date;
  duration: number;
  progress: number;
  dependencies: string[];
  isOnCriticalPath: boolean;
  resources: string[];
}
