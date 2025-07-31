/**
 * MUI Template Library - Index
 *
 * Centralized export for all template components following the MUI migration plan
 * This library provides consistent, reusable components with:
 * - Material-UI v7.2.0 components
 * - Tailwind CSS v3.4.17 utility classes
 * - Sarabun font integration for Thai/English support
 * - Responsive design patterns
 * - Consistent styling and behavior
 */

// Layout Templates
export { AuthLayout } from "./layouts/AuthLayout";
export { default as DashboardLayout } from "./layouts/DashboardLayout";
export { ErrorLayout } from "./layouts/ErrorLayout";

// Page Templates
export {
  DashboardGrid,
  DashboardSection,
  DashboardTemplate,
} from "./pages/DashboardTemplate";
export { DetailPageTemplate, DetailSection } from "./pages/DetailPageTemplate";

// Component Templates
export { ActionCard, CardTemplate, InfoCard } from "./components/CardTemplate";
export {
  ConfirmModal,
  FormModal,
  ModalTemplate,
} from "./components/ModalTemplate";

// Form Templates
export { FormTemplate } from "./forms/FormTemplate";

// Data Templates
export {
  commonTableActions,
  DataTableTemplate,
} from "./data/DataTableTemplate";

/**
 * Template Library Usage Examples:
 *
 * // Auth Layout
 * <AuthLayout title="Login" subtitle="Sign in to your account">
 *   <LoginFormMUI onSuccess={() => navigate("/dashboard")} />
 * </AuthLayout>
 *
 * // Form Template
 * <FormTemplate
 *   title="Create Project"
 *   subtitle="Enter project details"
 *   onSave={handleSave}
 *   onCancel={handleCancel}
 * >
 *   <TextField label="Project Name" />
 *   <TextField label="Description" multiline />
 * </FormTemplate>
 *
 * // Data Table Template
 * <DataTableTemplate
 *   title="Projects"
 *   subtitle="Manage your solar projects"
 *   rows={projects}
 *   columns={projectColumns}
 *   actions={[
 *     commonTableActions.view(handleView),
 *     commonTableActions.edit(handleEdit),
 *     commonTableActions.delete(handleDelete),
 *   ]}
 *   onAdd={() => setShowModal(true)}
 * />
 */

// Template configuration constants
export const templateDefaults = {
  layout: {
    maxWidth: 1200,
    spacing: 3,
    borderRadius: 2,
  },
  form: {
    elevation: 2,
    spacing: 2,
    actionSpacing: 2,
  },
  table: {
    pageSize: 10,
    pageSizeOptions: [5, 10, 25, 50],
    density: "standard" as const,
    height: 400,
  },
} as const;

// Color scheme for consistent theming
export const templateColors = {
  primary: "#1976d2", // MUI Blue
  secondary: "#f57c00", // Orange (for PEA branding)
  success: "#2e7d32", // Green
  error: "#d32f2f", // Red
  warning: "#ed6c02", // Orange
  info: "#0288d1", // Light Blue
  grey: {
    50: "#fafafa",
    100: "#f5f5f5",
    200: "#eeeeee",
    300: "#e0e0e0",
    400: "#bdbdbd",
    500: "#9e9e9e",
    600: "#757575",
    700: "#616161",
    800: "#424242",
    900: "#212121",
  },
} as const;

// Template Development Status:
// ✅ IMPLEMENTED: DashboardLayout, AuthLayout, FormTemplate, DataTableTemplate
// 🔄 IN PROGRESS: Component migration to MUI
// 📋 PLANNED: All other templates per migration plan
