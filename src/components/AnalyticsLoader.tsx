import React, { Suspense, lazy } from "react";
import { DailyReportAnalyticsDto } from "../shared/types/reports";

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
        <div className="flex items-center justify-center p-8 bg-white rounded-lg shadow">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading analytics...</span>
        </div>
      }
    >
      <LazyAnalytics {...props} />
    </Suspense>
  );
};

export default AnalyticsLoader;
