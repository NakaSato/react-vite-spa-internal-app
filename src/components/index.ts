// This file exports all components for easy importing
export {
  AnalyticsChartLoader,
  AnalyticsLoader,
  EnhancedAnalyticsLoader,
} from "./analytics";
export { GanttChartLoader } from "./charts";

// Re-export commonly used components from their feature locations
export { LoginForm, ProtectedRoute, RegisterForm } from "./auth";
export { OverviewTab } from "./dashboard";
export { ConstructionTab, CreateProjectModal, ProjectsTab } from "./projects";
export { ReportsTab } from "./reports";

// This file exports all reusable components used throughout the application.
// Components are now organized by category and feature

// Layout Components
export * from "./layout";

// Feedback Components
export * from "./feedback";

// Error Handling Components
export { default as ErrorBoundary } from "./ErrorBoundary";

// Form Components (remaining in components)
export { default as QuickReportForm } from "./QuickReportForm";
export { default as SimpleReports } from "./SimpleReports";
// Widget re-exports for convenience
export { default as ApiStatus } from "../widgets/ApiStatus";
export { default as NavbarApiStatus } from "../widgets/NavbarApiStatus";
