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
        <div className="w-full h-96 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <div className="text-gray-600 font-medium">
              Loading Project Timeline...
            </div>
            <div className="text-gray-400 text-sm mt-1">
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
