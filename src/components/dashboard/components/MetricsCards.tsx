import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import {
  formatCapacity,
  formatCurrency,
} from "../../../shared/utils/projectHelpers";

interface MetricsCardsProps {
  totalProjects: number;
  totalCapacity: number;
  totalBudget: number;
  budgetUtilization: number;
  statsLoading: boolean;
}

export const MetricsCards = ({
  totalProjects,
  totalCapacity,
  totalBudget,
  budgetUtilization,
  statsLoading,
}: MetricsCardsProps) => {
  const theme = useTheme();

  const metrics = [
    {
      title: "Active Projects",
      value: statsLoading ? "..." : totalProjects,
      icon: "🏗️",
      color: theme.palette.primary.main,
      gradient: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
    },
    {
      title: "Total Capacity",
      value: statsLoading ? "..." : formatCapacity(totalCapacity),
      icon: "⚡",
      color: theme.palette.success.main,
      gradient: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
    },
    {
      title: "Total Budget",
      value: statsLoading ? "..." : formatCurrency(totalBudget),
      icon: "💰",
      color: theme.palette.secondary.main,
      gradient: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
    },
    {
      title: "Budget Used",
      value: statsLoading ? "..." : `${budgetUtilization.toFixed(1)}%`,
      icon: "📊",
      color: theme.palette.warning.main,
      gradient: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.error.main} 100%)`,
    },
  ];

  return (
    <Grid container spacing={3}>
      {metrics.map((metric, index) => (
        <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={index}>
          <Card
            sx={{
              background: metric.gradient,
              color: "white",
              border: `1px solid ${alpha(metric.color, 0.3)}`,
              boxShadow: theme.shadows[8],
              transition: "all 0.3s ease-in-out",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: theme.shadows[12],
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 64,
                    height: 64,
                    borderRadius: 2,
                    bgcolor: alpha("#ffffff", 0.2),
                    backdropFilter: "blur(4px)",
                    mr: 2,
                  }}
                >
                  <Typography variant="h3" component="span">
                    {metric.icon}
                  </Typography>
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "Sarabun, sans-serif",
                      fontWeight: 500,
                      color: alpha("#ffffff", 0.8),
                      mb: 0.5,
                    }}
                  >
                    {metric.title}
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      fontFamily: "Sarabun, sans-serif",
                      fontWeight: 700,
                      color: "white",
                    }}
                  >
                    {metric.value}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default MetricsCards;
