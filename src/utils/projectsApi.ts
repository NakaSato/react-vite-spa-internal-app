import { apiClient } from "./apiClient";
import { Project, NewProjectForm } from "../types/project";
import { ApiResponse } from "../types/api";

export class ProjectsApiService {
  private readonly endpoint = "/api/projects";

  // Get all projects
  async getAllProjects(): Promise<Project[]> {
    try {
      const response = await apiClient.get<ApiResponse<Project[]>>(
        this.endpoint
      );
      return response.data || [];
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      throw new Error("Failed to fetch projects");
    }
  }

  // Get project by ID
  async getProjectById(id: string): Promise<Project> {
    try {
      const response = await apiClient.get<ApiResponse<Project>>(
        `${this.endpoint}/${id}`
      );
      if (!response.data) {
        throw new Error("Project not found");
      }
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch project ${id}:`, error);
      throw new Error(`Failed to fetch project ${id}`);
    }
  }

  // Create new project
  async createProject(projectData: NewProjectForm): Promise<Project> {
    try {
      const response = await apiClient.post<ApiResponse<Project>>(
        this.endpoint,
        projectData
      );
      if (!response.data) {
        throw new Error("Failed to create project");
      }
      return response.data;
    } catch (error) {
      console.error("Failed to create project:", error);
      throw new Error("Failed to create project");
    }
  }

  // Update project
  async updateProject(
    id: string,
    projectData: Partial<Project>
  ): Promise<Project> {
    try {
      const response = await apiClient.put<ApiResponse<Project>>(
        `${this.endpoint}/${id}`,
        projectData
      );
      if (!response.data) {
        throw new Error("Failed to update project");
      }
      return response.data;
    } catch (error) {
      console.error(`Failed to update project ${id}:`, error);
      throw new Error(`Failed to update project ${id}`);
    }
  }

  // Delete project
  async deleteProject(id: string): Promise<void> {
    try {
      await apiClient.delete<ApiResponse<void>>(`${this.endpoint}/${id}`);
    } catch (error) {
      console.error(`Failed to delete project ${id}:`, error);
      throw new Error(`Failed to delete project ${id}`);
    }
  }

  // Get projects by status
  async getProjectsByStatus(status: Project["status"]): Promise<Project[]> {
    try {
      const response = await apiClient.get<ApiResponse<Project[]>>(
        `${this.endpoint}?status=${status}`
      );
      return response.data || [];
    } catch (error) {
      console.error(`Failed to fetch projects with status ${status}:`, error);
      throw new Error(`Failed to fetch projects with status ${status}`);
    }
  }

  // Get construction projects (status = "Construction")
  async getConstructionProjects(): Promise<Project[]> {
    return this.getProjectsByStatus("Construction");
  }

  // Update project progress
  async updateProjectProgress(id: string, progress: number): Promise<Project> {
    try {
      const response = await apiClient.patch<ApiResponse<Project>>(
        `${this.endpoint}/${id}/progress`,
        { progress }
      );
      if (!response.data) {
        throw new Error("Failed to update project progress");
      }
      return response.data;
    } catch (error) {
      console.error(`Failed to update progress for project ${id}:`, error);
      throw new Error(`Failed to update progress for project ${id}`);
    }
  }

  // Get project statistics
  async getProjectStats(): Promise<{
    totalProjects: number;
    totalBudget: number;
    totalSpent: number;
    totalCapacity: number;
    statusDistribution: Record<string, number>;
  }> {
    try {
      const response = await apiClient.get<ApiResponse<any>>(
        `${this.endpoint}/stats`
      );
      return (
        response.data || {
          totalProjects: 0,
          totalBudget: 0,
          totalSpent: 0,
          totalCapacity: 0,
          statusDistribution: {},
        }
      );
    } catch (error) {
      console.error("Failed to fetch project statistics:", error);
      throw new Error("Failed to fetch project statistics");
    }
  }
}

// Create and export singleton instance
export const projectsApi = new ProjectsApiService();
