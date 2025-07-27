import { ApiClient } from "../utils/apiClient";
import { AuthApi, ProjectsApi, DailyReportsApi, UtilityApi } from "./modules";

/**
 * Refactored Solar Project API - Modular Architecture
 *
 * This replaces the monolithic solarProjectApi.ts with a clean, modular approach:
 * - Smaller, focused modules for different API domains
 * - Better maintainability and testing
 * - Cleaner separation of concerns
 * - Easier to extend and modify
 */
export class SolarProjectApi {
  private apiClient: ApiClient;

  // API modules - organized by domain
  public readonly auth: AuthApi;
  public readonly projects: ProjectsApi;
  public readonly dailyReports: DailyReportsApi;
  public readonly utility: UtilityApi;

  constructor() {
    this.apiClient = new ApiClient();

    // Initialize all API modules with the shared client
    this.auth = new AuthApi(this.apiClient);
    this.projects = new ProjectsApi(this.apiClient);
    this.dailyReports = new DailyReportsApi(this.apiClient);
    this.utility = new UtilityApi(this.apiClient);
  }

  // Authentication management
  setAuthToken(token: string): void {
    this.apiClient.setAuthToken(token);
  }

  clearAuthToken(): void {
    this.apiClient.clearAuthToken();
  }

  // Direct access to underlying client if needed
  getApiClient(): ApiClient {
    return this.apiClient;
  }
}

// Export singleton instance (maintains backward compatibility)
export const solarProjectApi = new SolarProjectApi();

// Usage examples:
// solarProjectApi.auth.login(credentials)
// solarProjectApi.projects.getProjects(params)
// solarProjectApi.dailyReports.createDailyReport(report)
// solarProjectApi.utility.getTasks(params)
