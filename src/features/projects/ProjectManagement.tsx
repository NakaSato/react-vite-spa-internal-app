import React, { useState, useEffect } from "react";
import { useAuth, useRole } from "../../shared/hooks/useAuth";
import { useProjects } from "../../shared/hooks/useProjects";
import { OverviewTab } from "../dashboard";
import ProjectsTab from "./ProjectsTab";
import ConstructionTab from "./ConstructionTab";
import ProgressDashboard from "./ProgressDashboard";
import GanttChart from "./GanttChart";
import { ReportsTab } from "../reports";
import CreateProjectModal from "./CreateProjectModal";
import EnhancedCreateProjectModal from "./EnhancedCreateProjectModal";
import {
  ProjectEntity,
  ProjectStatus,
  ActivityStatus,
} from "../../shared/types/project-management";
import { Project } from "../../shared/types/project";

// Tab definitions for internal navigation
type TabType =
  | "overview"
  | "projects"
  | "construction"
  | "planning"
  | "reports"
  | "analytics";

interface TabConfig {
  id: TabType;
  label: string;
  icon: string;
  description: string;
  requiredRole?: string[];
}

const tabs: TabConfig[] = [
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

  // Internal state management
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [useEnhancedModal, setUseEnhancedModal] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Demo project for components that need project data
  const demoProject: ProjectEntity = {
    projectId: "demo-001",
    projectName: "Solar Installation Demo",
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
  };

  // Filter and search logic
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || project.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Sort projects
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "status":
        return a.status.localeCompare(b.status);
      case "budget":
        return b.budget - a.budget;
      case "progress":
        return b.progress - a.progress;
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
    totalBudget: projects.reduce((sum, p) => sum + p.budget, 0),
    totalSpent: projects.reduce((sum, p) => sum + p.spent, 0),
    totalCapacity: projects.reduce((sum, p) => {
      const size = parseFloat(p.systemSize);
      return sum + (p.systemSize.includes("MW") ? size * 1000 : size);
    }, 0),
    budgetUtilization:
      projects.length > 0
        ? (projects.reduce((sum, p) => sum + p.spent, 0) /
            projects.reduce((sum, p) => sum + p.budget, 0)) *
          100
        : 0,
    statusDistribution: projects.reduce((acc, project) => {
      acc[project.status] = (acc[project.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
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
            {/* Search and Filter Controls */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label
                    htmlFor="search"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Search Projects
                  </label>
                  <input
                    id="search"
                    type="text"
                    placeholder="Search by name, location, client..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label
                    htmlFor="status-filter"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Filter by Status
                  </label>
                  <select
                    id="status-filter"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Statuses</option>
                    <option value="Planning">Planning</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="On Hold">On Hold</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="sort-by"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Sort By
                  </label>
                  <select
                    id="sort-by"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="name">Project Name</option>
                    <option value="status">Status</option>
                    <option value="budget">Budget</option>
                    <option value="progress">Progress</option>
                  </select>
                </div>

                <div className="flex items-end">
                  {(isAdmin || isManager) && (
                    <button
                      onClick={handleCreateProject}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                    >
                      + New Project
                    </button>
                  )}
                </div>
              </div>

              {/* Results summary */}
              <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
                <span>
                  Showing {paginatedProjects.length} of{" "}
                  {filteredProjects.length} projects
                  {searchTerm && ` matching "${searchTerm}"`}
                </span>
                <span>
                  Total Budget: ${projectStats.totalBudget.toLocaleString()}
                </span>
              </div>
            </div>

            <ProjectsTab
              projects={paginatedProjects}
              isAdmin={isAdmin}
              isManager={isManager}
              onCreateProject={handleCreateProject}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-6">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 rounded-lg border ${
                        currentPage === page
                          ? "bg-blue-600 text-white border-blue-600"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        );

      case "construction":
        return <ConstructionTab projects={projects} />;

      case "planning":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Project Timeline & Planning
              </h3>
              <p className="text-gray-600 mb-6">
                Interactive Gantt chart for project planning and timeline
                management.
              </p>
              <GanttChart project={demoProject} />
            </div>
            <ProgressDashboard project={demoProject} />
          </div>
        );

      case "reports":
        return <ReportsTab projects={projects} />;

      case "analytics":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Advanced Analytics
              </h3>
              <p className="text-gray-600 mb-6">
                Comprehensive data analysis and insights for project
                performance.
              </p>

              {/* Analytics Charts Placeholder */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6 h-64 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📊</div>
                    <h4 className="text-lg font-semibold text-gray-700">
                      Budget Analysis
                    </h4>
                    <p className="text-gray-500">Budget vs Actual Spending</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 h-64 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-2">⏱️</div>
                    <h4 className="text-lg font-semibold text-gray-700">
                      Timeline Analysis
                    </h4>
                    <p className="text-gray-500">Schedule Performance</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 h-64 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-2">⚡</div>
                    <h4 className="text-lg font-semibold text-gray-700">
                      Performance Metrics
                    </h4>
                    <p className="text-gray-500">KPI Dashboard</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 h-64 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🎯</div>
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
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Project Management Hub
                </h1>
                <p className="mt-2 text-gray-600">
                  Comprehensive solar project management and monitoring
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500">
                  Welcome, {user?.username}
                </div>
                <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                  {roleName}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {availableTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200 ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                title={tab.description}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-lg text-gray-600">
              Loading projects...
            </span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-yellow-400">⚠️</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-800">{error}</p>
                <button
                  onClick={refreshProjects}
                  className="mt-2 text-sm text-yellow-800 underline hover:text-yellow-900"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content */}
        {!loading && renderTabContent()}
      </div>

      {/* Create Project Modals */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Create New Project</h3>
            <p className="text-gray-600 mb-4">
              Project creation modal coming soon. This will integrate with the
              API endpoints.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleProjectCreated}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
