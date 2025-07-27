import React, { Suspense, lazy } from "react";

// Lazy load heavy dashboard components
const ProjectManagement = lazy(
  () => import("../features/projects/ProjectManagement")
);

interface ProjectManagementLoaderProps {
  [key: string]: any;
}

const ProjectManagementLoader: React.FC<ProjectManagementLoaderProps> = (
  props
) => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <div className="text-xl font-semibold text-gray-700 mb-2">
              Loading Project Management
            </div>
            <div className="text-gray-500">Preparing project dashboard...</div>
          </div>
        </div>
      }
    >
      <ProjectManagement {...props} />
    </Suspense>
  );
};

export default ProjectManagementLoader;
