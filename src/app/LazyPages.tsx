import React, { Suspense, lazy } from "react";

// Lazy load heavy pages to reduce initial bundle size
const LazyDashboard = lazy(() => import("../pages/Dashboard"));
const LazyProjectDetail = lazy(() => import("../pages/ProjectDetail"));
const LazyDailyReports = lazy(() => import("../pages/DailyReports"));
const LazyProjectSchedule = lazy(() => import("../pages/ProjectSchedule"));
const LazyTestIntegrationPage = lazy(
  () => import("../pages/TestIntegrationPage")
);
const LazyRealTimeProjectDashboard = lazy(
  () => import("../features/projects/RealTimeProjectDashboard")
);

// Loading component for page transitions
const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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

export const TestIntegrationPageLazy: React.FC = () => (
  <Suspense fallback={<PageLoader />}>
    <LazyTestIntegrationPage />
  </Suspense>
);

export const RealTimeProjectDashboardLazy: React.FC = () => (
  <Suspense fallback={<PageLoader />}>
    <LazyRealTimeProjectDashboard />
  </Suspense>
);
