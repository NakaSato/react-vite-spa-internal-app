import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  LinearProgress,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { ProjectDto } from "../../../shared/types/project";
import {
  formatCapacity,
  getStatusColor,
} from "../../../shared/utils/projectHelpers";

interface ProjectCardProps {
  project: ProjectDto;
  onClick: (projectId: string) => void;
}

export const ProjectCard = ({ project, onClick }: ProjectCardProps) => {
  const theme = useTheme();
  const progressPercentage =
    project.taskCount > 0
      ? Math.round((project.completedTaskCount / project.taskCount) * 100)
      : 0;

  // Convert Tailwind status colors to MUI chip colors
  const getChipColor = (status: string) => {
    const statusColor = getStatusColor(status);
    if (statusColor.includes("green")) return "success";
    if (statusColor.includes("blue")) return "primary";
    if (statusColor.includes("yellow")) return "warning";
    if (statusColor.includes("red")) return "error";
    return "default";
  };

  return (
    <Card
      onClick={() => onClick(project.projectId)}
      sx={{
        cursor: "pointer",
        borderRadius: 3,
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.background.default, 0.5)} 100%)`,
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          transform: "scale(1.05)",
          borderColor: theme.palette.primary.main,
          boxShadow: theme.shadows[8],
        },
      }}
      title={`Click to view details for ${project.projectName || "Unnamed Project"}`}
    >
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontFamily: "Sarabun, sans-serif",
              fontWeight: 700,
              color: theme.palette.text.primary,
              flex: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              mr: 2,
            }}
          >
            {project.projectName || "Unnamed Project"}
          </Typography>
          <Chip
            label={project.status || "Unknown"}
            color={getChipColor(project.status || "Unknown")}
            size="small"
            sx={{
              fontFamily: "Sarabun, sans-serif",
              fontWeight: 600,
              fontSize: "0.75rem",
            }}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontFamily: "Sarabun, sans-serif",
                fontWeight: 500,
                color: theme.palette.text.secondary,
              }}
            >
              Progress:
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontFamily: "Sarabun, sans-serif",
                fontWeight: 700,
                color: theme.palette.text.primary,
              }}
            >
              {progressPercentage}%
            </Typography>
          </Box>

          <LinearProgress
            variant="determinate"
            value={progressPercentage}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: alpha(theme.palette.divider, 0.1),
              "& .MuiLinearProgress-bar": {
                borderRadius: 4,
                background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              },
            }}
          />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 1,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontFamily: "Sarabun, sans-serif",
                color: theme.palette.text.secondary,
              }}
            >
              {project.completedTaskCount} / {project.taskCount} tasks
            </Typography>
            {project.totalCapacityKw && (
              <Typography
                variant="caption"
                sx={{
                  fontFamily: "Sarabun, sans-serif",
                  color: theme.palette.text.secondary,
                }}
              >
                {formatCapacity(project.totalCapacityKw)}
              </Typography>
            )}
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontFamily: "Sarabun, sans-serif",
                color: theme.palette.text.secondary,
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              🏢 {project.clientInfo || "No client"}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontFamily: "Sarabun, sans-serif",
                color: theme.palette.text.secondary,
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              📍 {project.address || "No address"}
            </Typography>
          </Box>
          {project.startDate && (
            <Typography
              variant="caption"
              sx={{
                fontFamily: "Sarabun, sans-serif",
                color: theme.palette.text.secondary,
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              📅 Started: {new Date(project.startDate).toLocaleDateString()}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
