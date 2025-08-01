import {
  Box,
  Card,
  Grid,
  Paper,
  Skeleton,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { formatCapacity } from "../../../shared/utils/projectHelpers";

interface OverviewHeaderProps {
  totalProjects: number;
  todayReportsCount: number;
  totalCapacity: number;
  loading?: boolean;
}

export const OverviewHeader = ({
  totalProjects,
  todayReportsCount,
  totalCapacity,
  loading = false,
}: OverviewHeaderProps) => {
  const theme = useTheme();

  const stats = [
    {
      value: totalProjects,
      label: "Active Projects",
      color: theme.palette.success.main,
      trend: "+12%",
      trendDirection: "up",
    },
    {
      value: todayReportsCount,
      label: "Today's Reports",
      color: theme.palette.warning.main,
      trend: "+5%",
      trendDirection: "up",
    },
    {
      value: formatCapacity(totalCapacity),
      label: "Total Capacity",
      color: theme.palette.info.main,
      trend: "+8%",
      trendDirection: "up",
    },
  ];

  return (
    <Card
      sx={{
        position: "relative",
        backgroundColor: theme.palette.background.paper,
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: "none",
        overflow: "hidden",
        transition: "all 0.2s ease",
        "&:hover": {
          transform: "translateY(-1px)",
          borderColor: alpha(theme.palette.primary.main, 0.2),
          boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.08)}`,
        },
      }}
    >
      <Box sx={{ p: { xs: 1, sm: 2, md: 3 }, position: "relative", zIndex: 1 }}>
        <Grid container spacing={{ xs: 1, sm: 2, lg: 3 }} alignItems="center">
          {/* Header Text */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <Box sx={{ textAlign: { xs: "center", lg: "left" } }}>
              {loading ? (
                <>
                  <Skeleton
                    variant="text"
                    width="70%"
                    height={28}
                    sx={{
                      height: { xs: 28, sm: 40 },
                    }}
                  />
                  <Skeleton
                    variant="text"
                    width="50%"
                    height={12}
                    sx={{
                      display: { xs: "none", sm: "block" },
                      height: { xs: 12, sm: 20 },
                    }}
                  />
                </>
              ) : (
                <>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 600,
                      mb: { xs: 0.25, sm: 0.5 },
                      fontSize: { xs: "1.125rem", sm: "1.5rem", md: "1.75rem" },
                      color: theme.palette.text.primary,
                    }}
                  >
                    Project Overview
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.text.secondary,
                      fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.875rem" },
                      fontWeight: 400,
                      lineHeight: 1.2,
                      display: { xs: "none", sm: "block" },
                    }}
                  >
                    Real-time project insights
                  </Typography>
                </>
              )}
            </Box>
          </Grid>

          {/* Stats Cards */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <Grid container spacing={{ xs: 0.5, sm: 1 }}>
              {stats.map((stat, index) => (
                <Grid key={index} size={{ xs: 4, sm: 4, lg: 12 }}>
                  {loading ? (
                    <Skeleton
                      variant="rectangular"
                      height={45}
                      sx={{
                        borderRadius: 2,
                        height: { xs: 80, sm: 60 },
                      }}
                    />
                  ) : (
                    <Paper
                      elevation={0}
                      sx={{
                        p: { xs: 1.5, sm: 1.5 },
                        borderRadius: 2,
                        border: `1px solid ${theme.palette.divider}`,
                        backgroundColor: "transparent",
                        transition: "all 0.2s ease",
                        cursor: "pointer",
                        minHeight: { xs: 60, sm: 60 },
                        "&:hover": {
                          transform: "translateY(-1px)",
                          borderColor: alpha(theme.palette.primary.main, 0.3),
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            0.02
                          ),
                          boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.06)}`,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          textAlign: { xs: "center", sm: "left", lg: "left" },
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "baseline",
                            gap: { xs: 0.25, sm: 0.5 },
                            justifyContent: {
                              xs: "center",
                              sm: "flex-start",
                              lg: "flex-start",
                            },
                            flexWrap: "wrap",
                            flexDirection: { xs: "column", sm: "row" },
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 600,
                              color: theme.palette.text.primary,
                              fontSize: {
                                xs: "1rem",
                                sm: "1rem",
                                md: "1.125rem",
                              },
                              lineHeight: 1,
                            }}
                          >
                            {stat.value}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color:
                                stat.trendDirection === "up"
                                  ? theme.palette.success.main
                                  : theme.palette.error.main,
                              fontWeight: 700,
                              fontSize: { xs: "0.65rem", sm: "0.7rem" },
                              border: `1px solid ${
                                stat.trendDirection === "up"
                                  ? theme.palette.success.main
                                  : theme.palette.error.main
                              }`,
                              px: { xs: 0.5, sm: 0.5 },
                              py: { xs: 0.25, sm: 0.25 },
                              borderRadius: 2,
                              display: { xs: "inline-flex", sm: "inline-flex" },
                              alignItems: "center",
                              gap: 0.25,
                              mt: { xs: 0.5, sm: 0 },
                              backgroundColor: "transparent",
                              "&::before": {
                                content:
                                  stat.trendDirection === "up"
                                    ? '"↗"'
                                    : '"↘"',
                                fontSize: "0.8em",
                                fontWeight: 900,
                              },
                            }}
                          >
                            {stat.trend}
                          </Typography>
                        </Box>
                        <Typography
                          variant="caption"
                          sx={{
                            color: theme.palette.text.secondary,
                            fontWeight: 500,
                            fontSize: { xs: "0.7rem", sm: "0.65rem" },
                            lineHeight: 1.2,
                            display: "block",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: { xs: "nowrap", sm: "normal" },
                            mt: { xs: 0.5, sm: 0.25 },
                          }}
                        >
                          {stat.label}
                        </Typography>
                      </Box>
                    </Paper>
                  )}
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
};

export default OverviewHeader;
