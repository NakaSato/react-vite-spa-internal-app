// This file exports various reusable components used throughout the application.
// Most components have been moved to feature-specific directories

export { default as Footer } from "./Footer";

// Re-export commonly used components from their new locations
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
