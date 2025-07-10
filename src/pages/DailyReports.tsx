import React from "react";
import { DailyReportsManagement } from "../features/reports";

const DailyReports: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <DailyReportsManagement showAnalytics={true} />
    </div>
  );
};

export default DailyReports;
