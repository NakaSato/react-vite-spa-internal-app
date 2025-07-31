/**
 * Page Templates Export
 *
 * Centralized export for all page-level template components
 */

export {
  DashboardGrid,
  DashboardSection,
  DashboardTemplate,
} from "./DashboardTemplate";
export { DetailPageTemplate, DetailSection } from "./DetailPageTemplate";

// Re-export types for external usage
export type { default as DashboardTemplateProps } from "./DashboardTemplate";
export type { default as DetailPageTemplateProps } from "./DetailPageTemplate";
