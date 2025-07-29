// This file exports various reusable components used throughout the application.
// Components are now organized by category and feature

// Layout Components
export * from "./layout";

// Feedback Components
export * from "./feedback";

// Form Components (remaining in components)
export { default as QuickReportForm } from "./QuickReportForm";
export { default as SimpleReports } from "./SimpleReports";

// Feature Re-exports (for backward compatibility) - Only export loaders to avoid circular dependencies
export {
  AnalyticsLoader,
  AnalyticsChartLoader,
  EnhancedAnalyticsLoader,
} from "../features/analytics";
export { GanttChartLoader } from "../features/charts";

// Re-export commonly used components from their feature locations
export { ProtectedRoute } from "../features/auth";
export { LoginForm, RegisterForm } from "../features/auth";
export {
  ProjectsTab,
  ConstructionTab,
  CreateProjectModal,
} from "../features/projects";
export { ReportsTab } from "../features/reports";
export { OverviewTab } from "../features/dashboard";
export { default as ApiStatus } from "../widgets/ApiStatus";
export { default as NavbarApiStatus } from "../widgets/NavbarApiStatus";
