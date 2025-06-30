// Application constants
export const APP_ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  ABOUT: "/about",
} as const;

export const USER_ROLES = {
  ADMIN: "Admin",
  MANAGER: "Manager",
  USER: "User",
  VIEWER: "Viewer",
} as const;

export const PROJECT_STATUS = {
  PLANNING: "Planning",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  ON_HOLD: "On Hold",
} as const;

export const CONNECTION_TYPES = {
  LV: "LV",
  MV: "MV",
  HV: "HV",
} as const;
