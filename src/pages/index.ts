// Core Application Pages
export * from "./core";

// Authentication Pages
export * from "./auth";

// Project Management Pages
export * from "./projects";

// Reporting Pages
export * from "./reports";

// Legacy direct exports for backward compatibility
export { default as Home } from "./core/Home";
export { default as Dashboard } from "./core/Dashboard";
export { default as About } from "./core/About";
export { default as NotFound } from "./core/NotFound";
export { default as Login } from "./auth/Login";
export { default as Register } from "./auth/Register";
export { default as ProjectDetail } from "./projects/ProjectDetail";
export { default as ProjectSchedule } from "./projects/ProjectSchedule";
export { default as ProjectDebug } from "./projects/ProjectDebug";
export { default as DailyReports } from "./reports/DailyReports";
