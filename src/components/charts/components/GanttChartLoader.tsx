import React, { Suspense, lazy } from "react";

// Lazy load the heavy Gantt chart component
const GanttChart = lazy(() => import("./GanttChart"));

interface GanttChartLoaderProps {
  projects: any[];
  onTaskUpdate?: (taskId: string, updates: any) => void;
  className?: string;
}

const GanttChartLoader: React.FC<GanttChartLoaderProps> = (props) => {
  return (
    <Suspense
      fallback={
        <div className="flex h-96 w-full items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <div className="font-medium text-gray-600">
              Loading Project Timeline...
            </div>
            <div className="mt-1 text-sm text-gray-400">
              Preparing interactive Gantt chart
            </div>
          </div>
        </div>
      }
    >
      <GanttChart {...props} />
    </Suspense>
  );
};

export default GanttChartLoader;
