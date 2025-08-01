import React, { Suspense, lazy } from "react";

// Lazy load the DailyReportsManagement component to reduce bundle size
const LazyDailyReportsManagement = lazy(
  () => import("./DailyReportsManagement")
);

interface DailyReportsManagementLoaderProps {
  projectId?: string;
  userId?: string;
  showAnalytics?: boolean;
}

const DailyReportsManagementLoader: React.FC<
  DailyReportsManagementLoaderProps
> = (props) => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center rounded-lg bg-white p-12 shadow">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading Daily Reports...</p>
            <p className="text-sm text-gray-500">
              Preparing reports management interface
            </p>
          </div>
        </div>
      }
    >
      <LazyDailyReportsManagement {...props} />
    </Suspense>
  );
};

export default DailyReportsManagementLoader;
