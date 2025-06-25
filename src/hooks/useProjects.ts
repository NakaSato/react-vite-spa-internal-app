import { useState, useEffect, useCallback } from "react";
import { Project, NewProjectForm } from "../types/project";
import { projectsApi } from "../utils/projectsApi";
import { mockProjects } from "../data/mockProjects";

interface ProjectStats {
  totalProjects: number;
  totalBudget: number;
  totalSpent: number;
  totalCapacity: number;
  budgetUtilization?: number;
  statusDistribution?: Record<string, number>;
}

interface UseProjectsReturn {
  projects: Project[];
  loading: boolean;
  error: string | null;
  stats: ProjectStats | null;
  statsLoading: boolean;
  createProject: (projectData: NewProjectForm) => Promise<void>;
  updateProject: (id: string, projectData: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  updateProjectProgress: (id: string, progress: number) => Promise<void>;
  refreshProjects: () => Promise<void>;
  refreshStats: () => Promise<void>;
  getConstructionProjects: () => Project[];
  getProjectStats: () => ProjectStats;
}

export const useProjects = (
  useMockData: boolean = false
): UseProjectsReturn => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<ProjectStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // Fetch project statistics from API or calculate locally
  const fetchStats = useCallback(async () => {
    if (useMockData) {
      // Calculate stats locally from mock data
      const localStats = calculateStatsLocally(projects);
      setStats(localStats);
      return;
    }

    try {
      setStatsLoading(true);
      const apiStats = await projectsApi.getProjectStats();
      // Add budget utilization calculation
      const budgetUtilization =
        apiStats.totalBudget > 0
          ? (apiStats.totalSpent / apiStats.totalBudget) * 100
          : 0;

      setStats({
        ...apiStats,
        budgetUtilization,
      });
    } catch (err) {
      console.warn("Failed to fetch stats from API, calculating locally:", err);
      const localStats = calculateStatsLocally(projects);
      setStats(localStats);
    } finally {
      setStatsLoading(false);
    }
  }, [useMockData, projects]);

  // Calculate stats locally (fallback or mock mode)
  const calculateStatsLocally = (projectList: Project[]): ProjectStats => {
    const totalBudget = projectList.reduce((sum, p) => sum + p.budget, 0);
    const totalSpent = projectList.reduce((sum, p) => sum + p.spent, 0);
    const totalCapacity = projectList.reduce((sum, p) => {
      const size = parseFloat(p.systemSize);
      return sum + (p.systemSize.includes("MW") ? size * 1000 : size);
    }, 0);

    const statusDistribution = projectList.reduce((acc, project) => {
      acc[project.status] = (acc[project.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalProjects: projectList.length,
      totalBudget,
      totalSpent,
      totalCapacity,
      budgetUtilization: totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0,
      statusDistribution,
    };
  };

  // Fetch projects from API or use mock data
  const fetchProjects = useCallback(async () => {
    if (useMockData) {
      setProjects(mockProjects);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await projectsApi.getAllProjects();
      setProjects(data);
    } catch (err) {
      console.warn("API not available, falling back to mock data:", err);
      setError("API not available, using mock data");
      setProjects(mockProjects);
    } finally {
      setLoading(false);
    }
  }, [useMockData]);

  // Create new project
  const createProject = useCallback(
    async (projectData: NewProjectForm) => {
      if (useMockData) {
        // Mock creation for development
        const newProject: Project = {
          id: `P${String(projects.length + 1).padStart(3, "0")}`,
          name: projectData.projectName,
          client: projectData.clientInfo,
          status: projectData.status,
          progress: 0,
          startDate: projectData.startDate,
          expectedCompletion: projectData.estimatedEndDate,
          systemSize: `${projectData.totalCapacityKw} kW`,
          location: projectData.address,
          priority: "Medium",
          assignedTeam: ["Team Alpha"],
          budget: projectData.ftsValue,
          spent: 0,
        };
        setProjects((prev) => [...prev, newProject]);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const newProject = await projectsApi.createProject(projectData);
        setProjects((prev) => [...prev, newProject]);
      } catch (err) {
        setError("Failed to create project");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [projects.length, useMockData]
  );

  // Update project
  const updateProject = useCallback(
    async (id: string, projectData: Partial<Project>) => {
      if (useMockData) {
        setProjects((prev) =>
          prev.map((project) =>
            project.id === id ? { ...project, ...projectData } : project
          )
        );
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const updatedProject = await projectsApi.updateProject(id, projectData);
        setProjects((prev) =>
          prev.map((project) => (project.id === id ? updatedProject : project))
        );
      } catch (err) {
        setError("Failed to update project");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [useMockData]
  );

  // Delete project
  const deleteProject = useCallback(
    async (id: string) => {
      if (useMockData) {
        setProjects((prev) => prev.filter((project) => project.id !== id));
        return;
      }

      try {
        setLoading(true);
        setError(null);
        await projectsApi.deleteProject(id);
        setProjects((prev) => prev.filter((project) => project.id !== id));
      } catch (err) {
        setError("Failed to delete project");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [useMockData]
  );

  // Update project progress
  const updateProjectProgress = useCallback(
    async (id: string, progress: number) => {
      if (useMockData) {
        setProjects((prev) =>
          prev.map((project) =>
            project.id === id ? { ...project, progress } : project
          )
        );
        return;
      }

      try {
        setError(null);
        const updatedProject = await projectsApi.updateProjectProgress(
          id,
          progress
        );
        setProjects((prev) =>
          prev.map((project) => (project.id === id ? updatedProject : project))
        );
      } catch (err) {
        setError("Failed to update project progress");
        throw err;
      }
    },
    [useMockData]
  );

  // Get construction projects
  const getConstructionProjects = useCallback(() => {
    return projects.filter((project) => project.status === "Construction");
  }, [projects]);

  // Get project statistics (returns calculated stats or fallback)
  const getProjectStats = useCallback((): ProjectStats => {
    if (stats) {
      return stats;
    }
    // Fallback to local calculation if API stats not available
    return calculateStatsLocally(projects);
  }, [stats, projects]);

  // Refresh statistics
  const refreshStats = useCallback(async () => {
    await fetchStats();
  }, [fetchStats]);

  // Refresh projects
  const refreshProjects = useCallback(async () => {
    await fetchProjects();
  }, [fetchProjects]);

  // Initial load
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Fetch stats when projects change
  useEffect(() => {
    if (projects.length > 0) {
      fetchStats();
    }
  }, [projects, fetchStats]);

  return {
    projects,
    loading,
    error,
    stats,
    statsLoading,
    createProject,
    updateProject,
    deleteProject,
    updateProjectProgress,
    refreshProjects,
    refreshStats,
    getConstructionProjects,
    getProjectStats,
  };
};
