import React from "react";
import { DailyReportsManagementLoader } from "../features/reports";

const DailyReports: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <DailyReportsManagementLoader showAnalytics={true} />
    </div>
  );
};

export default DailyReports;
