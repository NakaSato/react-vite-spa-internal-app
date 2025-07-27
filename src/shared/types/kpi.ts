// KPI and Analytics types for Project Schedule Management
export interface ProjectKPIs {
  schedulePerformanceIndex: number;
  onTimeDeliveryRate: number;
  resourceUtilization: number;
  qualityScore: number;
  completionForecast: Date;
  riskLevel: "low" | "medium" | "high" | "critical";
}

export interface ProgressTrends {
  dates: string[];
  plannedProgress: number[];
  actualProgress: number[];
  variance: number[];
}

export interface PerformanceMetrics {
  costPerformanceIndex: number;
  schedulePerformanceIndex: number;
  qualityIndex: number;
  safetyIndex: number;
  efficiency: number;
}

export interface RiskIndicator {
  category: "schedule" | "budget" | "quality" | "resources" | "safety";
  level: "low" | "medium" | "high" | "critical";
  count: number;
  trend: "increasing" | "stable" | "decreasing";
  description?: string;
}

export interface BurndownData {
  date: string;
  plannedWork: number;
  actualWork: number;
  remainingWork: number;
}

export interface ResourceAllocation {
  resourceId: string;
  resourceName: string;
  role: string;
  allocation: number; // percentage
  utilization: number; // percentage
  availability: number; // percentage
}

export interface KPITarget {
  metric: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  trend: "up" | "down" | "stable";
  status: "on_track" | "at_risk" | "behind";
}
