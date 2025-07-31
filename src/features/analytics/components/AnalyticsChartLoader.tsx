import React, { Suspense, lazy } from "react";
import { DailyReportAnalyticsDto } from "@shared/types/reports";

// Lazy load the full analytics charts component
const AnalyticsCharts = lazy(() => import("./AnalyticsCharts"));

interface AnalyticsChartLoaderProps {
  analytics: DailyReportAnalyticsDto;
}

const AnalyticsChartLoader: React.FC<AnalyticsChartLoaderProps> = ({
  analytics,
}) => {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-64 rounded-lg bg-gray-200"></div>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="h-64 animate-pulse rounded-lg bg-gray-200"></div>
            <div className="h-64 animate-pulse rounded-lg bg-gray-200"></div>
          </div>
          <div className="text-center text-gray-500">
            Loading analytics charts...
          </div>
        </div>
      }
    >
      <AnalyticsCharts analytics={analytics} />
    </Suspense>
  );
};

export default AnalyticsChartLoader;
