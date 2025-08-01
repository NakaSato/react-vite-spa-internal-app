import {
  Box,
  CircularProgress,
  Container,
  Fade,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import React, { Suspense, lazy } from "react";

// Lazy load heavy pages to reduce initial bundle size
const LazyDashboard = lazy(() => import("../pages/core/Dashboard"));
const LazyProjectDetail = lazy(() => import("../pages/projects/ProjectDetail"));
const LazyProjectDetailRefactored = lazy(
  () => import("../pages/projects/ProjectDetail")
);
const LazyDailyReports = lazy(() => import("../pages/reports/DailyReports"));
const LazyProjectSchedule = lazy(
  () => import("../pages/projects/ProjectSchedule")
);
const LazyRealTimeProjectDashboard = lazy(
  () => import("../components/projects/RealTimeProjectDashboard")
);

// Loading component for page transitions
const PageLoader: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: alpha(theme.palette.background.default, 0.8),
        backdropFilter: "blur(4px)",
        zIndex: theme.zIndex.modal,
      }}
    >
      <Container maxWidth="sm">
        <Fade in timeout={300}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 3,
              py: 4,
              px: 3,
              bgcolor: "background.paper",
              borderRadius: 3,
              boxShadow: theme.shadows[8],
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            <CircularProgress
              size={56}
              thickness={4}
              sx={{
                color: theme.palette.primary.main,
              }}
            />
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "Sarabun, sans-serif",
                  fontWeight: 600,
                  color: "text.primary",
                  mb: 1,
                }}
              >
                Loading page...
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: "Sarabun, sans-serif",
                  color: "text.secondary",
                }}
              >
                Please wait while we prepare the content
              </Typography>
            </Box>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

// Wrapper components with Suspense
export const DashboardLazy: React.FC = () => (
  <Suspense fallback={<PageLoader />}>
    <LazyDashboard />
  </Suspense>
);

export const ProjectDetailLazy: React.FC = () => (
  <Suspense fallback={<PageLoader />}>
    <LazyProjectDetail />
  </Suspense>
);

export const ProjectDetailRefactoredLazy: React.FC = () => (
  <Suspense fallback={<PageLoader />}>
    <LazyProjectDetailRefactored />
  </Suspense>
);

export const DailyReportsLazy: React.FC = () => (
  <Suspense fallback={<PageLoader />}>
    <LazyDailyReports />
  </Suspense>
);

export const ProjectScheduleLazy: React.FC = () => (
  <Suspense fallback={<PageLoader />}>
    <LazyProjectSchedule />
  </Suspense>
);

export const RealTimeProjectDashboardLazy: React.FC = () => (
  <Suspense fallback={<PageLoader />}>
    <LazyRealTimeProjectDashboard />
  </Suspense>
);
