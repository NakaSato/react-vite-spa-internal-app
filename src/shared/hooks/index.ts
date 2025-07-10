// This file exports custom hooks that encapsulate reusable logic for the application.

export { useApi } from "./useApi";
export { useProjects } from "./useProjects";
export { useAuth, useRole } from "./useAuth";
export {
  useDailyReports,
  useDailyReportAnalytics,
  useDailyReportTemplates,
  useDailyReportBulkOperations,
} from "./useDailyReports";
