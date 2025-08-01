import React, { Suspense, lazy } from "react";
import { DailyReportAnalytics } from "@shared/types/project";

// Lazy load the EnhancedAnalytics component to reduce bundle size
const LazyEnhancedAnalytics = lazy(() => import("./EnhancedAnalytics"));

interface EnhancedAnalyticsLoaderProps {
  analytics: DailyReportAnalytics;
  projectId: string;
}

const EnhancedAnalyticsLoader: React.FC<EnhancedAnalyticsLoaderProps> = (
  props
) => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center rounded-lg bg-white p-8 shadow">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">
            Loading enhanced analytics...
          </span>
        </div>
      }
    >
      <LazyEnhancedAnalytics {...props} />
    </Suspense>
  );
};

export default EnhancedAnalyticsLoader;
