import React from "react";
import { Project } from "../../shared/types/project";
import {
  getStatusColor,
  formatCurrency,
  formatCapacity,
} from "../../shared/utils/projectHelpers";

interface ProjectStats {
  totalProjects: number;
  totalBudget: number;
  totalSpent: number;
  totalCapacity: number;
  budgetUtilization?: number;
  statusDistribution?: Record<string, number>;
}

interface OverviewTabProps {
  projects: Project[];
  stats?: ProjectStats | null;
  statsLoading?: boolean;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  projects,
  stats,
  statsLoading = false,
}) => {
  // Fallback to local calculation if stats not available
  const totalBudget =
    stats?.totalBudget ?? projects.reduce((sum, p) => sum + p.budget, 0);
  const totalSpent =
    stats?.totalSpent ?? projects.reduce((sum, p) => sum + p.spent, 0);
  const totalCapacity =
    stats?.totalCapacity ??
    projects.reduce((sum, p) => {
      const size = parseFloat(p.systemSize);
      return sum + (p.systemSize.includes("MW") ? size * 1000 : size);
    }, 0);
  const budgetUtilization =
    stats?.budgetUtilization ??
    (totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0);
  const totalProjects = stats?.totalProjects ?? projects.length;

  return (
    <div className="space-y-10">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 overflow-hidden shadow-2xl rounded-2xl border border-blue-400 transform hover:scale-105 transition-all duration-300">
          <div className="p-8 text-white">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <span className="text-4xl">🏗️</span>
                </div>
              </div>
              <div className="ml-6 w-0 flex-1">
                <dl>
                  <dt className="text-lg font-medium text-blue-100 truncate">
                    Active Projects
                  </dt>
                  <dd className="text-4xl font-bold text-white">
                    {statsLoading ? "..." : totalProjects}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 overflow-hidden shadow-2xl rounded-2xl border border-green-400 transform hover:scale-105 transition-all duration-300">
          <div className="p-8 text-white">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <span className="text-4xl">⚡</span>
                </div>
              </div>
              <div className="ml-6 w-0 flex-1">
                <dl>
                  <dt className="text-lg font-medium text-green-100 truncate">
                    Total Capacity
                  </dt>
                  <dd className="text-4xl font-bold text-white">
                    {statsLoading ? "..." : formatCapacity(totalCapacity)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 overflow-hidden shadow-2xl rounded-2xl border border-purple-400 transform hover:scale-105 transition-all duration-300">
          <div className="p-8 text-white">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <span className="text-4xl">💰</span>
                </div>
              </div>
              <div className="ml-6 w-0 flex-1">
                <dl>
                  <dt className="text-lg font-medium text-purple-100 truncate">
                    Total Budget
                  </dt>
                  <dd className="text-4xl font-bold text-white">
                    {statsLoading ? "..." : formatCurrency(totalBudget)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-500 overflow-hidden shadow-2xl rounded-2xl border border-orange-400 transform hover:scale-105 transition-all duration-300">
          <div className="p-8 text-white">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <span className="text-4xl">📊</span>
                </div>
              </div>
              <div className="ml-6 w-0 flex-1">
                <dl>
                  <dt className="text-lg font-medium text-orange-100 truncate">
                    Budget Used
                  </dt>
                  <dd className="text-4xl font-bold text-white">
                    {statsLoading ? "..." : `${budgetUtilization.toFixed(1)}%`}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Status Overview */}
      <div className="bg-white shadow-xl rounded-2xl border border-gray-200">
        <div className="px-8 py-6 border-b border-gray-200">
          <h3 className="text-3xl font-bold text-gray-900">
            Project Status Overview
          </h3>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.slice(0, 3).map((project) => (
              <div
                key={project.id}
                className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <h4 className="text-xl font-bold text-gray-900 mb-6">
                  {project.name}
                </h4>
                <div className="space-y-6">
                  <div className="flex justify-between text-lg">
                    <span className="text-gray-600 font-medium">Status:</span>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(
                        project.status
                      )}`}
                    >
                      {project.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span className="text-gray-600 font-medium">Progress:</span>
                    <span className="text-gray-900 font-bold">
                      {project.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-300 rounded-full h-4">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-500 shadow-lg"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
