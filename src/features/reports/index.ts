export { default as ReportsTab } from "./ReportsTab";
// export { default as DailyReportsManagement } from "./DailyReportsManagement"; // Moved to lazy loader
export { default as DailyReportsManagementLoader } from "./DailyReportsManagementLoader";
export { default as DailyReportForm } from "./DailyReportForm";
export { default as ProjectReportLoader } from "./ProjectReportLoader";
// ProjectReport is only used as a dynamic import in reportService.ts
// Removing static export to enable proper code splitting
