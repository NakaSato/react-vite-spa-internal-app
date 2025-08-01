import React from "react";

interface AnalyticsBannerProps {
  analytics: any;
  project: any;
}

const AnalyticsBanner = ({ analytics, project }: AnalyticsBannerProps) => {
  return (
    <div className="rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
      {/* Project Analytics Summary */}
      {analytics ? (
        <>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-900">
                {analytics.totalProjects.toLocaleString()}
              </div>
              <div className="text-xs text-blue-700">Total Projects</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-700">
                {analytics.activeProjects.toLocaleString()}
              </div>
              <div className="text-xs text-blue-700">Active</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-emerald-700">
                {analytics.completedProjects.toLocaleString()}
              </div>
              <div className="text-xs text-blue-700">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-700">
                {analytics.totalCapacityKw.toLocaleString()}kW
              </div>
              <div className="text-xs text-blue-700">Total Capacity</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-orange-700">
                {analytics.totalPvModules.toLocaleString()}
              </div>
              <div className="text-xs text-blue-700">PV Modules</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-indigo-700">
                {analytics.projectManagerCount.toLocaleString()}
              </div>
              <div className="text-xs text-blue-700">Managers</div>
            </div>
          </div>

          {/* Additional Analytics Row */}
          <div className="mt-2 grid grid-cols-2 gap-3 border-t border-blue-100 pt-2 md:grid-cols-4">
            <div className="text-center">
              <div className="text-sm font-bold text-yellow-700">
                {analytics.planningProjects.toLocaleString()}
              </div>
              <div className="text-xs text-blue-600">Planning</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-orange-600">
                {analytics.onHoldProjects.toLocaleString()}
              </div>
              <div className="text-xs text-blue-600">On Hold</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-red-600">
                {analytics.cancelledProjects.toLocaleString()}
              </div>
              <div className="text-xs text-blue-600">Cancelled</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-green-600">
                ${(analytics.totalRevenueValue / 1000000).toFixed(1)}M
              </div>
              <div className="text-xs text-blue-600">Est. Revenue</div>
            </div>
          </div>
        </>
      ) : (
        <div className="rounded-lg bg-blue-50 p-4 text-center text-blue-700">
          <div className="text-sm font-medium">📊 Analytics Unavailable</div>
          <div className="mt-1 text-xs">
            Unable to load analytics data from API. Please check your connection
            and try refreshing.
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsBanner;
