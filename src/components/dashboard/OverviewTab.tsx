import { Box, Container } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useDailyReports } from "../../shared/hooks";
import { GetProjectsParams, ProjectDto } from "../../shared/types/project";
import { projectsApi } from "../../shared/utils/projectsApi";
import {
  NavigationTabs,
  OverviewHeader,
  ProjectsOverview,
  RecentDailyReports,
} from "./components";

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

      console.log("[OverviewTab] Fetching active projects count");

      // Fetch only active project statuses (not Completed or Cancelled)
      const response = await projectsApi.getAllProjects({
        pageNumber: 1,
        pageSize: 1, // We only need the count, not the actual data
        status: "InProgress,Planning,OnHold", // Active statuses
      });

      console.log("[OverviewTab] Active projects count:", response.totalCount);

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

        console.log("[OverviewTab] API Response:", {
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

  // Fetch active projects count on mount
  useEffect(() => {
    fetchActiveProjectsCount();
  }, [fetchActiveProjectsCount]);

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
    <Container
      maxWidth={false}
      sx={{
        maxWidth: "1600px", // Equivalent to max-w-8xl
        mx: "auto",
        px: { xs: 0.5, sm: 1, md: 2, lg: 3 },
        py: { xs: 0.5, sm: 1, md: 1.5 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: { xs: 1, sm: 1.5, md: 2, lg: 2.5 },
        }}
      >
        {/* Overview Header */}
        <OverviewHeader
          totalProjects={totalProjects}
          todayReportsCount={todayReports.length}
          totalCapacity={totalCapacity}
        />

        {/* Navigation Tabs */}
        <NavigationTabs />

        {/* Key Metrics Cards */}
        {/* <MetricsCards
        totalProjects={totalProjects}
        totalCapacity={totalCapacity}
        totalBudget={totalBudget}
        budgetUtilization={budgetUtilization}
        statsLoading={statsLoading}
      /> */}

        {/* Project Status Overview */}
        <ProjectsOverview
          paginatedData={paginatedData}
          projectsLoading={projectsLoading}
          projectsError={projectsError}
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          sortBy={sortBy}
          onSearch={handleSearch}
          onStatusFilter={handleStatusFilter}
          onSortChange={handleSortChange}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onRefresh={() => {
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
          onProjectClick={handleProjectClick}
        />

        {/* Recent Daily Reports Widget */}
        <RecentDailyReports reports={recentReports} loading={reportsLoading} />
      </Box>
    </Container>
  );
};

export default OverviewTab;
