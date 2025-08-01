import { RefreshOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { ProjectDto } from "../../../shared/types/project";
import { Pagination } from "./Pagination";
import { ProjectCard } from "./ProjectCard";
import { ProjectFilters } from "./ProjectFilters";

interface PaginatedProjectsData {
  projects: ProjectDto[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalPages: number;
}

interface ProjectsOverviewProps {
  paginatedData: PaginatedProjectsData;
  projectsLoading: boolean;
  projectsError: string | null;
  searchTerm: string;
  statusFilter: string;
  sortBy: string;
  onSearch: (term: string) => void;
  onStatusFilter: (status: string) => void;
  onSortChange: (sort: string) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onRefresh: () => void;
  onProjectClick: (projectId: string) => void;
}

export const ProjectsOverview = ({
  paginatedData,
  projectsLoading,
  projectsError,
  searchTerm,
  statusFilter,
  sortBy,
  onSearch,
  onStatusFilter,
  onSortChange,
  onPageChange,
  onPageSizeChange,
  onRefresh,
  onProjectClick,
}: ProjectsOverviewProps) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        borderRadius: 4,
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        background: theme.palette.background.paper,
        boxShadow: theme.shadows[8],
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          borderBottom: `1px solid ${theme.palette.divider}`,
          background: `linear-gradient(135deg, ${alpha(theme.palette.background.default, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
          px: 4,
          py: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontFamily: "Sarabun, sans-serif",
                fontWeight: 700,
                color: theme.palette.text.primary,
                mb: 0.5,
              }}
            >
              Project Status Overview
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontFamily: "Sarabun, sans-serif",
                color: theme.palette.text.secondary,
              }}
            >
              Current status of your active projects
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Chip
              label={`${paginatedData.totalCount} Total Projects`}
              color="primary"
              size="small"
              sx={{
                fontFamily: "Sarabun, sans-serif",
                fontWeight: 600,
                "& .MuiChip-label": {
                  px: 2,
                },
              }}
            />
            <Chip
              label={`Page ${paginatedData.pageNumber} of ${paginatedData.totalPages}`}
              variant="outlined"
              size="small"
              sx={{
                fontFamily: "Sarabun, sans-serif",
                fontWeight: 500,
                "& .MuiChip-label": {
                  px: 2,
                },
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Search and Filter Controls */}
      <ProjectFilters
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        sortBy={sortBy}
        pageSize={paginatedData.pageSize}
        onSearch={onSearch}
        onStatusFilter={onStatusFilter}
        onSortChange={onSortChange}
        onPageSizeChange={onPageSizeChange}
        onRefresh={onRefresh}
      />

      {/* Content */}
      <CardContent sx={{ p: 4 }}>
        {projectsLoading ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              py: 8,
              gap: 2,
            }}
          >
            <CircularProgress size={32} color="primary" />
            <Typography
              variant="body1"
              sx={{
                fontFamily: "Sarabun, sans-serif",
                color: theme.palette.text.secondary,
              }}
            >
              Loading projects...
            </Typography>
          </Box>
        ) : projectsError ? (
          <Box sx={{ py: 8, textAlign: "center" }}>
            <Typography
              variant="h2"
              sx={{ mb: 2, fontSize: "4rem" }}
              role="img"
              aria-label="Error"
            >
              ❌
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontFamily: "Sarabun, sans-serif",
                fontWeight: 600,
                color: theme.palette.text.primary,
                mb: 1,
              }}
            >
              Error loading projects
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontFamily: "Sarabun, sans-serif",
                color: theme.palette.text.secondary,
                mb: 3,
              }}
            >
              {projectsError}
            </Typography>
            <Button
              onClick={onRefresh}
              variant="contained"
              startIcon={<RefreshOutlined />}
              sx={{
                fontFamily: "Sarabun, sans-serif",
                fontWeight: 600,
                borderRadius: 2,
                px: 3,
                py: 1,
              }}
            >
              Try Again
            </Button>
          </Box>
        ) : paginatedData.totalCount === 0 ? (
          <Box sx={{ py: 8, textAlign: "center" }}>
            <Typography
              variant="h2"
              sx={{ mb: 2, fontSize: "4rem" }}
              role="img"
              aria-label="Construction"
            >
              🏗️
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontFamily: "Sarabun, sans-serif",
                fontWeight: 600,
                color: theme.palette.text.primary,
                mb: 1,
              }}
            >
              No projects found
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontFamily: "Sarabun, sans-serif",
                color: theme.palette.text.secondary,
              }}
            >
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria."
                : "Get started by creating your first project."}
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {paginatedData.projects.map((project) => (
              <Grid key={project.projectId} size={{ xs: 12, md: 6, lg: 4 }}>
                <ProjectCard project={project} onClick={onProjectClick} />
              </Grid>
            ))}
          </Grid>
        )}

        {/* Pagination Controls */}
        {paginatedData.totalCount > 0 && (
          <Pagination
            currentPage={paginatedData.pageNumber}
            totalPages={paginatedData.totalPages}
            pageSize={paginatedData.pageSize}
            totalCount={paginatedData.totalCount}
            hasNextPage={paginatedData.hasNextPage}
            hasPreviousPage={paginatedData.hasPreviousPage}
            onPageChange={onPageChange}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectsOverview;
