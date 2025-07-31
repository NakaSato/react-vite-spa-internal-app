// This file exports utility functions that provide helper methods for the application.

export * from "./apiClient";
export * from "./authService";
export * from "./debugHelper";
export * from "./masterPlanApi";
export * from "./progressCalculation";
export * from "./projectHelpers";
export * from "./projectsApi";
export * from "./reportService";
export * from "./simpleReportsService";
export * from "./solarProjectTemplate";
export * from "./toast";

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return (value / total) * 100;
};

export const debounce = <T extends unknown[]>(
  func: (...args: T) => void,
  delay: number
) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: T) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};
