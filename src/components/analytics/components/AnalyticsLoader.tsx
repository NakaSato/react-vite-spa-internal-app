import React, { Suspense, lazy } from "react";
import { DailyReportAnalyticsDto } from "@shared/types/reports";

// Lazy load the Analytics component to reduce bundle size
const LazyAnalytics = lazy(() => import("./Analytics"));

interface AnalyticsLoaderProps {
  analytics: DailyReportAnalyticsDto;
  projectId: string;
}

const AnalyticsLoader: React.FC<AnalyticsLoaderProps> = (props) => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center rounded-lg bg-white p-8 shadow">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading analytics...</span>
        </div>
      }
    >
      <LazyAnalytics {...props} />
    </Suspense>
  );
};

export default AnalyticsLoader;
