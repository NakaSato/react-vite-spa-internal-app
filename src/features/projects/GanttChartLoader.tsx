import React, { Suspense, lazy } from "react";
import { ProjectEntity } from "../../shared/types/project-management";

// Lazy load the GanttChart component to reduce bundle size
const LazyGanttChart = lazy(() => import("./GanttChart"));

interface GanttChartLoaderProps {
  project: ProjectEntity;
  onTaskUpdate?: (taskId: string, updates: any) => void;
  className?: string;
}

const GanttChartLoader: React.FC<GanttChartLoaderProps> = (props) => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-12 bg-white rounded-lg shadow">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading Gantt Chart...</p>
            <p className="text-sm text-gray-500">
              Preparing project timeline visualization
            </p>
          </div>
        </div>
      }
    >
      <LazyGanttChart {...props} />
    </Suspense>
  );
};

export default GanttChartLoader;
