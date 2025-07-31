import React, { useState, useEffect, useCallback } from "react";
import { ProjectDto, GetProjectsParams } from "../../shared/types/project";
import {
  getStatusColor,
  formatCurrency,
  formatCapacity,
} from "../../shared/utils/projectHelpers";
import { useDailyReports } from "../../shared/hooks";
import { projectsApi } from "../../shared/utils/projectsApi";

interface ProjectStats {
  totalProjects: number;
  totalBudget: number;
  totalSpent: number;
  totalCapacity: number;
  budgetUtilization?: number;
  statusDistribution?: Record<string, number>;
}

interface PaginatedProjectsData {
  projects: ProjectDto[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalPages: number;
}

interface ActiveProjectsData {
  totalCount: number;
  loading: boolean;
  error: string | null;
}

interface OverviewTabProps {
  projects: ProjectDto[];
  stats?: ProjectStats | null;
  statsLoading?: boolean;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  projects,
  stats,
  statsLoading = false,
}) => {
  // Pagination state for Project Status Overview
  const [paginatedData, setPaginatedData] = useState<PaginatedProjectsData>({
    projects: [],
    totalCount: 0,
    pageNumber: 1,
    pageSize: 6,
    hasNextPage: false,
    hasPreviousPage: false,
    totalPages: 0,
  });
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectsError, setProjectsError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");

  // Separate state for active projects count
  const [activeProjectsData, setActiveProjectsData] =
    useState<ActiveProjectsData>({
      totalCount: 0,
      loading: true,
      error: null,
    });

  // Get recent daily reports
  const { reports: recentReports, loading: reportsLoading } = useDailyReports();
  const todayReports = recentReports.filter((report) => {
    const reportDate = new Date(report.reportDate);
    const today = new Date();
    return reportDate.toDateString() === today.toDateString();
  });

  // Fetch active projects count from API
  const fetchActiveProjectsCount = useCallback(async () => {
    try {
      setActiveProjectsData((prev) => ({
        ...prev,
        loading: true,
        error: null,
      }));

      console.log("🔄 [OverviewTab] Fetching active projects count");

      // Fetch only active project statuses (not Completed or Cancelled)
      const response = await projectsApi.getAllProjects({
        pageNumber: 1,
        pageSize: 1, // We only need the count, not the actual data
        status: "InProgress,Planning,OnHold", // Active statuses
      });

      console.log(
        "✅ [OverviewTab] Active projects count:",
        response.totalCount
      );

      setActiveProjectsData({
        totalCount: response.totalCount,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error(
        "[OverviewTab] Error fetching active projects count:",
        error
      );
      setActiveProjectsData({
        totalCount: 0,
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch active projects count",
      });
    }
  }, []);

  // Fetch paginated projects from API
  const fetchPaginatedProjects = useCallback(
    async (params: GetProjectsParams) => {
      try {
        setProjectsLoading(true);
        setProjectsError(null);

        console.log(
          "[OverviewTab] Fetching paginated projects with params:",
          params
        );

        const response = await projectsApi.getAllProjects(params);

        console.log("✅ [OverviewTab] API Response:", {
          totalCount: response.totalCount,
          pageNumber: response.pageNumber,
          pageSize: response.pageSize,
          hasNextPage: response.hasNextPage,
          hasPreviousPage: response.hasPreviousPage,
          itemsLength: response.items?.length || 0,
        });

        const totalPages = Math.ceil(response.totalCount / response.pageSize);

        setPaginatedData({
          projects: response.items || [],
          totalCount: response.totalCount,
          pageNumber: response.pageNumber,
          pageSize: response.pageSize,
          hasNextPage: response.hasNextPage,
          hasPreviousPage: response.hasPreviousPage,
          totalPages,
        });
      } catch (error) {
        console.error(
          "[OverviewTab] Error fetching paginated projects:",
          error
        );
        setProjectsError(
          error instanceof Error ? error.message : "Failed to fetch projects"
        );
      } finally {
        setProjectsLoading(false);
      }
    },
    []
  );

  // Initial load and when filters change
  useEffect(() => {
    const params: GetProjectsParams = {
      pageNumber: paginatedData.pageNumber,
      pageSize: paginatedData.pageSize,
      search: searchTerm || undefined,
      status: statusFilter !== "all" ? statusFilter : undefined,
      sortBy: sortBy || undefined,
      sortOrder: "asc",
    };

    fetchPaginatedProjects(params);
  }, [
    paginatedData.pageNumber,
    paginatedData.pageSize,
    searchTerm,
    statusFilter,
    sortBy,
    fetchPaginatedProjects,
  ]);

  // Pagination handlers
  const handlePageChange = (newPage: number) => {
    setPaginatedData((prev) => ({
      ...prev,
      pageNumber: newPage,
    }));
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPaginatedData((prev) => ({
      ...prev,
      pageSize: newPageSize,
      pageNumber: 1, // Reset to first page
    }));
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setPaginatedData((prev) => ({
      ...prev,
      pageNumber: 1, // Reset to first page
    }));
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setPaginatedData((prev) => ({
      ...prev,
      pageNumber: 1, // Reset to first page
    }));
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    setPaginatedData((prev) => ({
      ...prev,
      pageNumber: 1, // Reset to first page
    }));
  };

  // Handle clicking on project cards to open detail page in new tab
  const handleProjectClick = (projectId: string) => {
    const projectUrl = `/projects/${projectId}`;
    window.open(projectUrl, "_blank");
    console.log(
      "🔗 [OverviewTab] Opening project detail in new tab:",
      projectId
    );
  };

  // Fallback to local calculation if stats not available
  const totalBudget =
    stats?.totalBudget ??
    projects.reduce((sum, p) => sum + (p.revenueValue || 0), 0);
  const totalSpent =
    stats?.totalSpent ??
    projects.reduce((sum, p) => sum + (p.ftsValue || 0), 0);
  const totalCapacity =
    stats?.totalCapacity ??
    projects.reduce((sum, p) => sum + (p.totalCapacityKw || 0), 0);
  const budgetUtilization =
    stats?.budgetUtilization ??
    (totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0);
  // Use API total count for active projects, fallback to local projects length
  const totalProjects =
    stats?.totalProjects ?? (paginatedData.totalCount || projects.length);

  return (
    <div className="space-y-8">
      {/* Enhanced Header Section */}
      <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 shadow-2xl">
        <div className="px-8 py-12 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-4xl font-bold">Project Overview</h1>
              <p className="text-lg text-blue-100">
                Comprehensive dashboard for project management and daily
                reporting
              </p>
            </div>
            <div className="hidden items-center space-x-6 lg:flex">
              <div className="text-center">
                <div className="text-3xl font-bold">{totalProjects}</div>
                <div className="text-sm text-blue-200">Active Projects</div>
              </div>
              <div className="h-12 w-px bg-blue-400"></div>
              <div className="text-center">
                <div className="text-3xl font-bold">{todayReports.length}</div>
                <div className="text-sm text-blue-200">Today's Reports</div>
              </div>
              <div className="h-12 w-px bg-blue-400"></div>
              <div className="text-center">
                <div className="text-3xl font-bold">
                  {formatCapacity(totalCapacity)}
                </div>
                <div className="text-sm text-blue-200">Total Capacity</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <div className="flex space-x-8">
            <button className="flex items-center space-x-2 rounded-lg bg-blue-100 px-4 py-2 font-medium text-blue-700">
              <span className="text-xl">📊</span>
              <span>Overview</span>
            </button>
            <button className="flex items-center space-x-2 rounded-lg px-4 py-2 font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900">
              <span className="text-xl">🏗️</span>
              <span>Projects</span>
            </button>
            <button className="flex items-center space-x-2 rounded-lg px-4 py-2 font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900">
              <span className="text-xl">📈</span>
              <span>Reports</span>
            </button>
            <button className="flex items-center space-x-2 rounded-lg px-4 py-2 font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900">
              <span className="text-xl">⚡</span>
              <span>Construction</span>
            </button>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleTimeString()}
            </span>
            <div className="h-2 w-2 animate-pulse rounded-full bg-green-400"></div>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="transform overflow-hidden rounded-2xl border border-blue-400 bg-gradient-to-br from-blue-500 to-blue-600 shadow-xl transition-all duration-300 hover:scale-105">
          <div className="p-6 text-white">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                  <span className="text-3xl">🏗️</span>
                </div>
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="truncate text-base font-medium text-blue-100">
                    Active Projects
                  </dt>
                  <dd className="text-3xl font-bold text-white">
                    {statsLoading ? "..." : totalProjects}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="transform overflow-hidden rounded-2xl border border-green-400 bg-gradient-to-br from-green-500 to-green-600 shadow-xl transition-all duration-300 hover:scale-105">
          <div className="p-6 text-white">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                  <span className="text-3xl">⚡</span>
                </div>
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="truncate text-base font-medium text-green-100">
                    Total Capacity
                  </dt>
                  <dd className="text-3xl font-bold text-white">
                    {statsLoading ? "..." : formatCapacity(totalCapacity)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="transform overflow-hidden rounded-2xl border border-purple-400 bg-gradient-to-br from-purple-500 to-purple-600 shadow-xl transition-all duration-300 hover:scale-105">
          <div className="p-6 text-white">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                  <span className="text-3xl">💰</span>
                </div>
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="truncate text-base font-medium text-purple-100">
                    Total Budget
                  </dt>
                  <dd className="text-3xl font-bold text-white">
                    {statsLoading ? "..." : formatCurrency(totalBudget)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="transform overflow-hidden rounded-2xl border border-orange-400 bg-gradient-to-br from-orange-500 to-red-500 shadow-xl transition-all duration-300 hover:scale-105">
          <div className="p-6 text-white">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                  <span className="text-3xl">📊</span>
                </div>
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="truncate text-base font-medium text-orange-100">
                    Budget Used
                  </dt>
                  <dd className="text-3xl font-bold text-white">
                    {statsLoading ? "..." : `${budgetUtilization.toFixed(1)}%`}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Status Overview */}
      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl">
        <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                Project Status Overview
              </h3>
              <p className="mt-1 text-gray-600">
                Current status of your active projects
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                {paginatedData.totalCount} Total Projects
              </span>
              <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800">
                Page {paginatedData.pageNumber} of {paginatedData.totalPages}
              </span>
            </div>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="border-b border-gray-200 bg-gray-50 px-8 py-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search Input */}
            <div className="min-w-64 flex-1">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 leading-5 placeholder-gray-500 focus:border-blue-500 focus:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Status Filter */}
            <select
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={statusFilter}
              onChange={(e) => handleStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="Planning">Planning</option>
              <option value="InProgress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="OnHold">On Hold</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            {/* Sort Options */}
            <select
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <option value="name">Sort by Name</option>
              <option value="status">Sort by Status</option>
              <option value="startDate">Sort by Start Date</option>
              <option value="capacity">Sort by Capacity</option>
            </select>

            {/* Page Size Selector */}
            <select
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={paginatedData.pageSize}
              onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
            >
              <option value={6}>6 per page</option>
              <option value={12}>12 per page</option>
              <option value={24}>24 per page</option>
            </select>

            {/* Refresh Button */}
            <button
              onClick={() => {
                fetchPaginatedProjects({
                  pageNumber: paginatedData.pageNumber,
                  pageSize: paginatedData.pageSize,
                  search: searchTerm || undefined,
                  status: statusFilter !== "all" ? statusFilter : undefined,
                  sortBy: sortBy || undefined,
                  sortOrder: "asc",
                });
                fetchActiveProjectsCount();
              }}
              className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        <div className="p-8">
          {projectsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading projects...</span>
            </div>
          ) : projectsError ? (
            <div className="py-12 text-center">
              <div className="mb-4 text-6xl text-red-500">❌</div>
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                Error loading projects
              </h3>
              <p className="mb-4 text-gray-500">{projectsError}</p>
              <button
                onClick={() => {
                  fetchPaginatedProjects({
                    pageNumber: paginatedData.pageNumber,
                    pageSize: paginatedData.pageSize,
                    search: searchTerm || undefined,
                    status: statusFilter !== "all" ? statusFilter : undefined,
                    sortBy: sortBy || undefined,
                    sortOrder: "asc",
                  });
                  fetchActiveProjectsCount();
                }}
                className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Try Again
              </button>
            </div>
          ) : paginatedData.totalCount === 0 ? (
            <div className="py-12 text-center">
              <div className="mb-4 text-6xl">🏗️</div>
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                No projects found
              </h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "Get started by creating your first project."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {paginatedData.projects.map((project) => (
                <div
                  key={project.projectId}
                  className="transform cursor-pointer rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6 transition-all duration-300 hover:scale-105 hover:border-blue-300 hover:shadow-xl"
                  onClick={() => handleProjectClick(project.projectId)} // Add click handler
                  title={`Click to view details for ${
                    project.projectName || "Unnamed Project"
                  }`}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="truncate text-lg font-bold text-gray-900">
                      {project.projectName || "Unnamed Project"}
                    </h4>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusColor(
                        project.status || "Unknown"
                      )}`}
                    >
                      {project.status || "Unknown"}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-600">
                        Progress:
                      </span>
                      <span className="font-bold text-gray-900">
                        {project.taskCount > 0
                          ? Math.round(
                              (project.completedTaskCount / project.taskCount) *
                                100
                            )
                          : 0}
                        %
                      </span>
                    </div>

                    <div className="h-2 w-full rounded-full bg-gray-200">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                        style={{
                          width: `${
                            project.taskCount > 0
                              ? Math.round(
                                  (project.completedTaskCount /
                                    project.taskCount) *
                                    100
                                )
                              : 0
                          }%`,
                        }}
                      />
                    </div>

                    <div className="flex justify-between text-xs text-gray-500">
                      <span>
                        {project.completedTaskCount} / {project.taskCount} tasks
                      </span>
                      {project.totalCapacityKw && (
                        <span>{formatCapacity(project.totalCapacityKw)}</span>
                      )}
                    </div>

                    {/* Additional project details */}
                    <div className="border-t border-gray-100 pt-3">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>🏢 {project.clientInfo || "No client"}</span>
                        <span>📍 {project.address || "No address"}</span>
                      </div>
                      {project.startDate && (
                        <div className="mt-1 text-xs text-gray-500">
                          📅 Started:{" "}
                          {new Date(project.startDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {paginatedData.totalCount > 0 && (
            <div className="mt-8 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">
                  Showing{" "}
                  {Math.min(
                    (paginatedData.pageNumber - 1) * paginatedData.pageSize + 1,
                    paginatedData.totalCount
                  )}{" "}
                  to{" "}
                  {Math.min(
                    paginatedData.pageNumber * paginatedData.pageSize,
                    paginatedData.totalCount
                  )}{" "}
                  of {paginatedData.totalCount} projects
                </span>
              </div>

              <div className="flex items-center space-x-2">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(paginatedData.pageNumber - 1)}
                  disabled={!paginatedData.hasPreviousPage}
                  className={`inline-flex items-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium transition-colors ${
                    paginatedData.hasPreviousPage
                      ? "bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      : "cursor-not-allowed bg-gray-100 text-gray-400"
                  }`}
                >
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Previous
                </button>

                {/* Page Numbers */}
                <div className="flex items-center space-x-1">
                  {Array.from(
                    { length: Math.min(5, paginatedData.totalPages) },
                    (_, i) => {
                      const page = i + 1;
                      const isCurrentPage = page === paginatedData.pageNumber;

                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`inline-flex items-center rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                            isCurrentPage
                              ? "border-blue-500 bg-blue-50 text-blue-600"
                              : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    }
                  )}

                  {paginatedData.totalPages > 5 && (
                    <>
                      <span className="px-2 text-gray-500">...</span>
                      <button
                        onClick={() =>
                          handlePageChange(paginatedData.totalPages)
                        }
                        className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                      >
                        {paginatedData.totalPages}
                      </button>
                    </>
                  )}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(paginatedData.pageNumber + 1)}
                  disabled={!paginatedData.hasNextPage}
                  className={`inline-flex items-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium transition-colors ${
                    paginatedData.hasNextPage
                      ? "bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      : "cursor-not-allowed bg-gray-100 text-gray-400"
                  }`}
                >
                  Next
                  <svg
                    className="ml-2 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Daily Reports Widget */}
      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl">
        <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Recent Daily Reports
            </h2>
            <a
              href="/daily-reports"
              className="inline-flex items-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-200"
            >
              View All Reports
              <svg
                className="-mr-1 ml-2 h-4 w-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>
        </div>
        <div className="p-8">
          {reportsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading reports...</span>
            </div>
          ) : recentReports.length === 0 ? (
            <div className="py-12 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No daily reports
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating your first daily report.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentReports.slice(0, 5).map((report) => (
                <div
                  key={report.id}
                  className="rounded-xl border border-gray-200 p-4 transition-all duration-200 hover:bg-gray-50 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center space-x-3">
                        <h4 className="text-sm font-semibold text-gray-900">
                          {report.projectName || "Unknown Project"}
                        </h4>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            report.approvalStatus === "Approved"
                              ? "bg-green-100 text-green-800"
                              : report.approvalStatus === "Submitted"
                                ? "bg-yellow-100 text-yellow-800"
                                : report.approvalStatus === "Rejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {report.approvalStatus}
                        </span>
                      </div>

                      <p className="mb-2 text-sm text-gray-500">
                        📅 {new Date(report.reportDate).toLocaleDateString()} •
                        👤 {report.userName}
                      </p>

                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        {report.weatherConditions && (
                          <span className="flex items-center space-x-1">
                            <span>🌤️</span>
                            <span>{report.weatherConditions}</span>
                          </span>
                        )}
                        <span className="flex items-center space-x-1">
                          <span>⏰</span>
                          <span>{report.hoursWorked}h worked</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <span>👥</span>
                          <span>{report.personnelOnSite} on site</span>
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-400">
                        {new Date(report.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {recentReports.length > 5 && (
                <div className="pt-4 text-center">
                  <a
                    href="/daily-reports"
                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    View {recentReports.length - 5} more reports →
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
