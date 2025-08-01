import React, { useState, useMemo } from "react";
import { useAuth, useRole } from "../../shared/hooks/useAuth";
import { useProjects } from "../../shared/hooks/useProjects";
import { OverviewTab } from "../dashboard";
import ProjectsDisplay from "./ProjectsDisplay";
import ConstructionTab from "./ConstructionTab";
import ProgressDashboard from "./ProgressDashboard";
import GanttChartLoader from "./GanttChartLoader";
import { ReportsTab } from "../reports";
import {
  ProjectEntity,
  ProjectStatus,
} from "../../shared/types/project-management";
import {
  projectDtosToProjects,
  projectDtosToProjectEntities,
  projectDtoToProjectEntity,
} from "../../shared/utils/projectTypeAdapter";

// Tab definitions for internal navigation
const tabs: {
  id:
    | "overview"
    | "projects"
    | "construction"
    | "planning"
    | "reports"
    | "analytics";
  label: string;
  icon: string;
  description: string;
  requiredRole?: string[];
}[] = [
  {
    id: "overview",
    label: "Overview",
    icon: "📊",
    description: "Project statistics and key metrics",
  },
  {
    id: "projects",
    label: "Projects",
    icon: "🏗️",
    description: "Manage all solar projects",
  },
  {
    id: "construction",
    label: "Construction",
    icon: "🔧",
    description: "Construction progress and activities",
  },
  {
    id: "planning",
    label: "Planning",
    icon: "📅",
    description: "Gantt charts and project timelines",
  },
  {
    id: "reports",
    label: "Reports",
    icon: "📈",
    description: "Generate and view project reports",
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: "📊",
    description: "Data analysis and insights",
    requiredRole: ["Admin", "Manager"],
  },
];

const ProjectManagement: React.FC = () => {
  const { user } = useAuth();
  const { isAdmin, isManager, roleName } = useRole();
  const { projects, loading, error, refreshProjects } = useProjects();

  // Log project data changes for debugging
  React.useEffect(() => {
    // Projects data updated successfully
  }, [projects, loading, error]);

  // User context initialized

  // Internal state management
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "projects"
    | "construction"
    | "planning"
    | "reports"
    | "analytics"
  >("overview");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [useEnhancedModal, setUseEnhancedModal] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Convert API project data to ProjectEntity format for internal components
  const projectEntities = useMemo(() => {
    return projectDtosToProjectEntities(projects);
  }, [projects]);

  // Get the first project entity for components that need a single project
  // In a real app, this would be selected based on user interaction or route params
  const selectedProjectEntity = useMemo(() => {
    if (projectEntities.length > 0) {
      return projectEntities[0];
    }

    // Fallback demo project only if no real projects exist
    return {
      projectId: "demo-001",
      projectName: "Demo Solar Installation",
      projectOwner: "Demo Owner",
      mainContractor: "Demo Contractor",
      plannedStartDate: new Date(),
      plannedEndDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      actualStartDate: new Date(),
      actualEndDate: undefined,
      status: ProjectStatus.IN_PROGRESS,
      overallCompletion: 0.25,
      phases: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    } as ProjectEntity;
  }, [projectEntities]);

  // Filter and search logic
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      (project.projectName?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      ) ||
      (project.address?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      ) ||
      (project.clientInfo?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      );

    const matchesStatus =
      statusFilter === "all" || project.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Sort projects
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return (a.projectName || "").localeCompare(b.projectName || "");
      case "status":
        return (a.status || "").localeCompare(b.status || "");
      case "budget":
        // Using totalCapacityKw as a proxy for budget since budget isn't in the current schema
        return (b.totalCapacityKw || 0) - (a.totalCapacityKw || 0);
      case "progress": {
        // Calculate progress from task completion
        const aProgress =
          a.taskCount > 0 ? (a.completedTaskCount / a.taskCount) * 100 : 0;
        const bProgress =
          b.taskCount > 0 ? (b.completedTaskCount / b.taskCount) * 100 : 0;
        return bProgress - aProgress;
      }
      default:
        return 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedProjects.length / itemsPerPage);
  const paginatedProjects = sortedProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Project statistics
  const projectStats = {
    totalProjects: projects.length,
    totalBudget: projects.reduce((sum, p) => sum + (p.revenueValue || 0), 0), // Using revenueValue as budget proxy
    totalSpent: projects.reduce((sum, p) => sum + (p.ftsValue || 0), 0), // Using ftsValue as spent proxy
    totalCapacity: projects.reduce((sum, p) => {
      return sum + (p.totalCapacityKw || 0);
    }, 0),
    budgetUtilization:
      projects.length > 0
        ? (projects.reduce((sum, p) => sum + (p.ftsValue || 0), 0) /
            Math.max(
              projects.reduce((sum, p) => sum + (p.revenueValue || 0), 0),
              1
            )) *
          100
        : 0,
    statusDistribution: projects.reduce(
      (acc, project) => {
        const status = project.status || "Unknown";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    ),
  };

  // Filter tabs based on user role
  const availableTabs = tabs.filter((tab) => {
    if (!tab.requiredRole) return true;
    return tab.requiredRole.includes(roleName || "");
  });

  const handleCreateProject = () => {
    setShowCreateModal(true);
  };

  const handleProjectCreated = () => {
    setShowCreateModal(false);
    refreshProjects();
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <OverviewTab
            projects={projects}
            stats={projectStats}
            statsLoading={loading}
          />
        );

      case "projects":
        return (
          <div className="space-y-6">
            <ProjectsDisplay
              projects={projects}
              loading={loading}
              error={error}
              onRefresh={refreshProjects}
              onCreateProject={handleCreateProject}
            />
          </div>
        );

      case "construction":
        return <ConstructionTab projects={projectDtosToProjects(projects)} />;

      case "planning":
        return (
          <div className="space-y-6">
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h3 className="mb-4 text-xl font-bold text-gray-900">
                Project Timeline & Planning
              </h3>
              <p className="mb-6 text-gray-600">
                Interactive Gantt chart for project planning and timeline
                management.
              </p>
              <GanttChartLoader project={selectedProjectEntity} />
            </div>
            <ProgressDashboard project={selectedProjectEntity} />
          </div>
        );

      case "reports":
        return <ReportsTab projects={projectDtosToProjects(projects)} />;

      case "analytics":
        return (
          <div className="space-y-6">
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h3 className="mb-4 text-xl font-bold text-gray-900">
                Advanced Analytics
              </h3>
              <p className="mb-6 text-gray-600">
                Comprehensive data analysis and insights for project
                performance.
              </p>

              {/* Analytics Charts Placeholder */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="flex h-64 items-center justify-center rounded-lg bg-gray-50 p-6">
                  <div className="text-center">
                    <div className="mb-2 text-4xl">📊</div>
                    <h4 className="text-lg font-semibold text-gray-700">
                      Budget Analysis
                    </h4>
                    <p className="text-gray-500">Budget vs Actual Spending</p>
                  </div>
                </div>

                <div className="flex h-64 items-center justify-center rounded-lg bg-gray-50 p-6">
                  <div className="text-center">
                    <div className="mb-2 text-4xl">⏱️</div>
                    <h4 className="text-lg font-semibold text-gray-700">
                      Timeline Analysis
                    </h4>
                    <p className="text-gray-500">Schedule Performance</p>
                  </div>
                </div>

                <div className="flex h-64 items-center justify-center rounded-lg bg-gray-50 p-6">
                  <div className="text-center">
                    <div className="mb-2 text-4xl">⚡</div>
                    <h4 className="text-lg font-semibold text-gray-700">
                      Performance Metrics
                    </h4>
                    <p className="text-gray-500">KPI Dashboard</p>
                  </div>
                </div>

                <div className="flex h-64 items-center justify-center rounded-lg bg-gray-50 p-6">
                  <div className="text-center">
                    <div className="mb-2 text-4xl">🎯</div>
                    <h4 className="text-lg font-semibold text-gray-700">
                      Risk Analysis
                    </h4>
                    <p className="text-gray-500">Project Risk Assessment</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Tab not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <span className="ml-3 text-lg text-gray-600">
              Loading projects...
            </span>
          </div>
        )}

        {/* Tab Content */}
        {!loading && renderTabContent()}
      </div>

      {/* Create Project Modals */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-semibold">Create New Project</h3>
            <p className="mb-4 text-gray-600">
              Project creation modal coming soon. This will integrate with the
              API endpoints.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleProjectCreated}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectManagement;
