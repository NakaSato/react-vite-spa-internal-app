import React from "react";
import { ProjectDto } from "../../shared/types/project";
import {
  getStatusColor,
  formatCurrency,
  formatCapacity,
} from "../../shared/utils/projectHelpers";
import { useDailyReports } from "../../shared/hooks";

interface ProjectStats {
  totalProjects: number;
  totalBudget: number;
  totalSpent: number;
  totalCapacity: number;
  budgetUtilization?: number;
  statusDistribution?: Record<string, number>;
}

interface OverviewTabProps {
  projects: ProjectDto[];
  stats?: ProjectStats | null;
  statsLoading?: boolean;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  projects,
  stats,
  statsLoading = false,
}) => {
  // Get recent daily reports
  const { reports: recentReports, loading: reportsLoading } = useDailyReports();
  const todayReports = recentReports.filter((report) => {
    const reportDate = new Date(report.reportDate);
    const today = new Date();
    return reportDate.toDateString() === today.toDateString();
  });

  // Fallback to local calculation if stats not available
  const totalBudget =
    stats?.totalBudget ??
    projects.reduce((sum, p) => sum + (p.revenueValue || 0), 0);
  const totalSpent =
    stats?.totalSpent ??
    projects.reduce((sum, p) => sum + (p.ftsValue || 0), 0);
  const totalCapacity =
    stats?.totalCapacity ??
    projects.reduce((sum, p) => sum + (p.totalCapacityKw || 0), 0);
  const budgetUtilization =
    stats?.budgetUtilization ??
    (totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0);
  const totalProjects = stats?.totalProjects ?? projects.length;

  return (
    <div className="space-y-8">
      {/* Enhanced Header Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl shadow-2xl overflow-hidden">
        <div className="px-8 py-12 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Project Overview</h1>
              <p className="text-blue-100 text-lg">
                Comprehensive dashboard for project management and daily
                reporting
              </p>
            </div>
            <div className="hidden lg:flex items-center space-x-6">
              <div className="text-center">
                <div className="text-3xl font-bold">{totalProjects}</div>
                <div className="text-blue-200 text-sm">Active Projects</div>
              </div>
              <div className="w-px h-12 bg-blue-400"></div>
              <div className="text-center">
                <div className="text-3xl font-bold">{todayReports.length}</div>
                <div className="text-blue-200 text-sm">Today's Reports</div>
              </div>
              <div className="w-px h-12 bg-blue-400"></div>
              <div className="text-center">
                <div className="text-3xl font-bold">
                  {formatCapacity(totalCapacity)}
                </div>
                <div className="text-blue-200 text-sm">Total Capacity</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex space-x-8">
            <button className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-100 text-blue-700 font-medium">
              <span className="text-xl">📊</span>
              <span>Overview</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 font-medium transition-colors">
              <span className="text-xl">🏗️</span>
              <span>Projects</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 font-medium transition-colors">
              <span className="text-xl">📈</span>
              <span>Reports</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 font-medium transition-colors">
              <span className="text-xl">⚡</span>
              <span>Construction</span>
            </button>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleTimeString()}
            </span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 overflow-hidden shadow-xl rounded-2xl border border-blue-400 transform hover:scale-105 transition-all duration-300">
          <div className="p-6 text-white">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <span className="text-3xl">🏗️</span>
                </div>
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-base font-medium text-blue-100 truncate">
                    Active Projects
                  </dt>
                  <dd className="text-3xl font-bold text-white">
                    {statsLoading ? "..." : totalProjects}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 overflow-hidden shadow-xl rounded-2xl border border-green-400 transform hover:scale-105 transition-all duration-300">
          <div className="p-6 text-white">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <span className="text-3xl">⚡</span>
                </div>
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-base font-medium text-green-100 truncate">
                    Total Capacity
                  </dt>
                  <dd className="text-3xl font-bold text-white">
                    {statsLoading ? "..." : formatCapacity(totalCapacity)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 overflow-hidden shadow-xl rounded-2xl border border-purple-400 transform hover:scale-105 transition-all duration-300">
          <div className="p-6 text-white">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <span className="text-3xl">💰</span>
                </div>
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-base font-medium text-purple-100 truncate">
                    Total Budget
                  </dt>
                  <dd className="text-3xl font-bold text-white">
                    {statsLoading ? "..." : formatCurrency(totalBudget)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-500 overflow-hidden shadow-xl rounded-2xl border border-orange-400 transform hover:scale-105 transition-all duration-300">
          <div className="p-6 text-white">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <span className="text-3xl">📊</span>
                </div>
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-base font-medium text-orange-100 truncate">
                    Budget Used
                  </dt>
                  <dd className="text-3xl font-bold text-white">
                    {statsLoading ? "..." : `${budgetUtilization.toFixed(1)}%`}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Status Overview */}
      <div className="bg-white shadow-xl rounded-3xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                Project Status Overview
              </h3>
              <p className="text-gray-600 mt-1">
                Current status of your active projects
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {projects.length} Projects
              </span>
            </div>
          </div>
        </div>
        <div className="p-8">
          {projects.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏗️</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No projects found
              </h3>
              <p className="text-gray-500">
                Get started by creating your first project.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.slice(0, 6).map((project) => (
                <div
                  key={project.projectId}
                  className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:border-blue-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-gray-900 truncate">
                      {project.projectName || "Unnamed Project"}
                    </h4>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(
                        project.status || "Unknown"
                      )}`}
                    >
                      {project.status || "Unknown"}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 font-medium">
                        Progress:
                      </span>
                      <span className="text-gray-900 font-bold">
                        {project.taskCount > 0
                          ? Math.round(
                              (project.completedTaskCount / project.taskCount) *
                                100
                            )
                          : 0}
                        %
                      </span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${
                            project.taskCount > 0
                              ? Math.round(
                                  (project.completedTaskCount /
                                    project.taskCount) *
                                    100
                                )
                              : 0
                          }%`,
                        }}
                      />
                    </div>

                    <div className="flex justify-between text-xs text-gray-500">
                      <span>
                        {project.completedTaskCount} / {project.taskCount} tasks
                      </span>
                      {project.totalCapacityKw && (
                        <span>{formatCapacity(project.totalCapacityKw)}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Daily Reports Widget */}
      <div className="bg-white shadow-2xl rounded-3xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Recent Daily Reports
            </h2>
            <a
              href="/daily-reports"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 transition-colors"
            >
              View All Reports
              <svg
                className="ml-2 -mr-1 w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>
        </div>
        <div className="p-8">
          {reportsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading reports...</span>
            </div>
          ) : recentReports.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No daily reports
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating your first daily report.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentReports.slice(0, 5).map((report) => (
                <div
                  key={report.id}
                  className="border rounded-xl p-4 hover:bg-gray-50 transition-all duration-200 hover:shadow-md border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-sm font-semibold text-gray-900">
                          {report.projectName || "Unknown Project"}
                        </h4>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            report.approvalStatus === "Approved"
                              ? "bg-green-100 text-green-800"
                              : report.approvalStatus === "Submitted"
                              ? "bg-yellow-100 text-yellow-800"
                              : report.approvalStatus === "Rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {report.approvalStatus}
                        </span>
                      </div>

                      <p className="text-sm text-gray-500 mb-2">
                        📅 {new Date(report.reportDate).toLocaleDateString()} •
                        👤 {report.userName}
                      </p>

                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        {report.weatherConditions && (
                          <span className="flex items-center space-x-1">
                            <span>🌤️</span>
                            <span>{report.weatherConditions}</span>
                          </span>
                        )}
                        <span className="flex items-center space-x-1">
                          <span>⏰</span>
                          <span>{report.hoursWorked}h worked</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <span>👥</span>
                          <span>{report.personnelOnSite} on site</span>
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-400">
                        {new Date(report.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {recentReports.length > 5 && (
                <div className="text-center pt-4">
                  <a
                    href="/daily-reports"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View {recentReports.length - 5} more reports →
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
