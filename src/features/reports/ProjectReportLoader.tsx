import React, { Suspense, lazy } from "react";
import { Project } from "../../shared/types/project";

// Lazy load the PDF report component to reduce bundle size
const LazyProjectReport = lazy(() => import("./ProjectReport"));

interface ProjectStats {
  totalProjects: number;
  totalBudget: number;
  totalSpent: number;
  totalCapacity: number;
  budgetUtilization?: number;
  statusDistribution?: Record<string, number>;
  activeProjects?: number;
}

interface ProjectReportLoaderProps {
  projects: Project[];
  stats: ProjectStats;
  reportType: "overview" | "detailed" | "financial";
  dateRange?: {
    startDate: string;
    endDate: string;
  };
}

const ProjectReportLoader: React.FC<ProjectReportLoaderProps> = (props) => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading PDF generator...</span>
        </div>
      }
    >
      <LazyProjectReport {...props} />
    </Suspense>
  );
};

export default ProjectReportLoader;
