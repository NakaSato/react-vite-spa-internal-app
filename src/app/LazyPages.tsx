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
  () => import("../features/projects/RealTimeProjectDashboard")
);

// Loading component for page transitions
const PageLoader: React.FC = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
    <span className="ml-3 text-lg text-gray-600">Loading page...</span>
  </div>
);

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
