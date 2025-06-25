import React from "react";
import { Project } from "../types/project";

interface ReportsTabProps {
  projects: Project[];
}

const ReportsTab: React.FC<ReportsTabProps> = ({ projects }) => {
  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
  const totalSpent = projects.reduce((sum, p) => sum + p.spent, 0);

  const statuses = [
    "Planning",
    "Design",
    "Permits",
    "Construction",
    "Inspection",
    "Completed",
  ] as const;

  return (
    <div className="space-y-8">
      <div className="bg-white shadow-xl rounded-2xl border border-gray-200">
        <div className="px-8 py-6 border-b border-gray-200">
          <h3 className="text-3xl font-bold text-gray-900">
            Financial Summary
          </h3>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl">
              <div className="text-4xl font-bold text-green-600">
                ${(totalBudget / 1000000).toFixed(1)}M
              </div>
              <div className="text-lg text-gray-600 font-medium mt-2">
                Total Budget
              </div>
            </div>
            <div className="text-center bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl">
              <div className="text-4xl font-bold text-blue-600">
                ${(totalSpent / 1000000).toFixed(1)}M
              </div>
              <div className="text-lg text-gray-600 font-medium mt-2">
                Total Spent
              </div>
            </div>
            <div className="text-center bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-2xl">
              <div className="text-4xl font-bold text-orange-600">
                {((totalSpent / totalBudget) * 100).toFixed(1)}%
              </div>
              <div className="text-lg text-gray-600 font-medium mt-2">
                Budget Utilization
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-xl rounded-2xl border border-gray-200">
        <div className="px-8 py-6 border-b border-gray-200">
          <h3 className="text-3xl font-bold text-gray-900">
            Project Status Distribution
          </h3>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {statuses.map((status) => {
              const count = projects.filter((p) => p.status === status).length;
              return (
                <div
                  key={status}
                  className="text-center bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl hover:shadow-lg transition-all duration-300"
                >
                  <div className="text-3xl font-bold text-gray-900">
                    {count}
                  </div>
                  <div className="text-base text-gray-600 font-medium mt-2">
                    {status}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsTab;
