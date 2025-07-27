import React from "react";
import { DailyReportAnalyticsDto } from "../shared/types/reports";

interface AnalyticsChartsProps {
  analytics: DailyReportAnalyticsDto;
}

const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ analytics }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          📈 Chart Analytics (Temporarily Disabled)
        </h3>
        <p className="text-gray-600">
          Charts are temporarily disabled for debugging purposes.
        </p>
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p>Project Name: {analytics.projectName}</p>
          <p>Total Reports: {analytics.totalReports}</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCharts;
