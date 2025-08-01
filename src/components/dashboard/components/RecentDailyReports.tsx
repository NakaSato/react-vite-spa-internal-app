import { ArrowForward, Description } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Link,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";

interface DailyReport {
  id: string;
  projectName?: string;
  approvalStatus: string;
  reportDate: string;
  userName: string;
  weatherConditions?: string;
  hoursWorked: number;
  personnelOnSite: number;
  createdAt: string;
}

interface RecentDailyReportsProps {
  reports: DailyReport[];
  loading: boolean;
}

export const RecentDailyReports = ({
  reports,
  loading,
}: RecentDailyReportsProps) => {
  const theme = useTheme();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "success";
      case "Submitted":
        return "warning";
      case "Rejected":
        return "error";
      default:
        return "default";
    }
  };

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
          <Typography
            variant="h4"
            sx={{
              fontFamily: "Sarabun, sans-serif",
              fontWeight: 700,
              color: theme.palette.text.primary,
            }}
          >
            Recent Daily Reports
          </Typography>
          <Button
            component="a"
            href="/daily-reports"
            variant="outlined"
            size="small"
            endIcon={<ArrowForward />}
            sx={{
              fontFamily: "Sarabun, sans-serif",
              fontWeight: 500,
              borderRadius: 2,
              px: 2,
              py: 1,
              borderColor: alpha(theme.palette.primary.main, 0.5),
              color: theme.palette.primary.main,
              "&:hover": {
                borderColor: theme.palette.primary.main,
                backgroundColor: alpha(theme.palette.primary.main, 0.04),
              },
            }}
          >
            View All Reports
          </Button>
        </Box>
      </Box>

      {/* Content */}
      <CardContent sx={{ p: 4 }}>
        {loading ? (
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
              Loading reports...
            </Typography>
          </Box>
        ) : reports.length === 0 ? (
          <Box sx={{ py: 8, textAlign: "center" }}>
            <Description
              sx={{
                fontSize: "3rem",
                color: theme.palette.text.disabled,
                mb: 2,
              }}
            />
            <Typography
              variant="h6"
              sx={{
                fontFamily: "Sarabun, sans-serif",
                fontWeight: 600,
                color: theme.palette.text.primary,
                mb: 1,
              }}
            >
              No daily reports
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontFamily: "Sarabun, sans-serif",
                color: theme.palette.text.secondary,
              }}
            >
              Get started by creating your first daily report.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {reports.slice(0, 5).map((report) => (
              <Card
                key={report.id}
                variant="outlined"
                sx={{
                  borderRadius: 3,
                  border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    backgroundColor: alpha(
                      theme.palette.background.default,
                      0.5
                    ),
                    boxShadow: theme.shadows[4],
                    transform: "translateY(-1px)",
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          mb: 1,
                          flexWrap: "wrap",
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontFamily: "Sarabun, sans-serif",
                            fontWeight: 600,
                            color: theme.palette.text.primary,
                          }}
                        >
                          {report.projectName || "Unknown Project"}
                        </Typography>
                        <Chip
                          label={report.approvalStatus}
                          color={getStatusColor(report.approvalStatus) as any}
                          size="small"
                          sx={{
                            fontFamily: "Sarabun, sans-serif",
                            fontWeight: 600,
                            fontSize: "0.75rem",
                          }}
                        />
                      </Box>

                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: "Sarabun, sans-serif",
                          color: theme.palette.text.secondary,
                          mb: 2,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        📅 {new Date(report.reportDate).toLocaleDateString()} •
                        👤 {report.userName}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          flexWrap: "wrap",
                        }}
                      >
                        {report.weatherConditions && (
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
                            🌤️ {report.weatherConditions}
                          </Typography>
                        )}
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
                          ⏰ {report.hoursWorked}h worked
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
                          👥 {report.personnelOnSite} on site
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ textAlign: "right", minWidth: "fit-content" }}>
                      <Typography
                        variant="caption"
                        sx={{
                          fontFamily: "Sarabun, sans-serif",
                          color: theme.palette.text.disabled,
                        }}
                      >
                        {new Date(report.createdAt).toLocaleTimeString()}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}

            {reports.length > 5 && (
              <Box sx={{ pt: 2, textAlign: "center" }}>
                <Link
                  href="/daily-reports"
                  sx={{
                    fontFamily: "Sarabun, sans-serif",
                    fontWeight: 500,
                    color: theme.palette.primary.main,
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                      color: theme.palette.primary.dark,
                    },
                  }}
                >
                  View {reports.length - 5} more reports →
                </Link>
              </Box>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentDailyReports;
