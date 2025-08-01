import React, { useState } from "react";
import { DailyReportAnalyticsDto } from "../../../shared/types/reports";
import AnalyticsChartLoader from "./AnalyticsChartLoader";

interface AnalyticsProps {
  analytics: DailyReportAnalyticsDto;
  projectId: string;
}

const Analytics: React.FC<AnalyticsProps> = ({ analytics, projectId }) => {
  const [activeTab, setActiveTab] = useState<"charts" | "summary">("summary");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            📊 Daily Reports Analytics
          </h1>
          <p className="text-gray-600">
            Comprehensive insights and performance metrics for project{" "}
            {analytics.projectName || projectId}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Analysis period:{" "}
            {new Date(analytics.analysisPeriodStart).toLocaleDateString()} -{" "}
            {new Date(analytics.analysisPeriodEnd).toLocaleDateString()}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("summary")}
                className={`border-b-2 px-1 py-2 text-sm font-medium ${
                  activeTab === "summary"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                📋 Summary
              </button>
              <button
                onClick={() => setActiveTab("charts")}
                className={`border-b-2 px-1 py-2 text-sm font-medium ${
                  activeTab === "charts"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                📈 Charts
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        {activeTab === "summary" ? (
          <div className="space-y-6">
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                      📊
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">
                      Total Reports
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {analytics.totalReports}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
                      ⏱️
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">
                      Hours Logged
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {analytics.totalHoursLogged}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-100">
                      🎯
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">
                      Avg Safety Score
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {analytics.averageSafetyScore?.toFixed(1) || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100">
                      ⚡
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">
                      Productivity
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {analytics.productivityIndex?.toFixed(1) || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Metrics */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  📈 Progress Metrics
                </h3>
                <dl className="space-y-3">
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Average Hours/Day</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {analytics.averageHoursPerDay?.toFixed(1) || "N/A"}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">
                      Progress Contribution
                    </dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {analytics.totalProgressContribution?.toFixed(1) || "N/A"}
                      %
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">
                      Average Progress/Day
                    </dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {analytics.averageProgressPerDay?.toFixed(2) || "N/A"}%
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Schedule Variance</dt>
                    <dd
                      className={`text-sm font-medium ${
                        (analytics.daysAheadBehindSchedule || 0) >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {analytics.daysAheadBehindSchedule > 0 && "+"}
                      {analytics.daysAheadBehindSchedule || 0} days
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  🌤️ Weather & Issues
                </h3>
                <dl className="space-y-3">
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">
                      Weather Delay Days
                    </dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {analytics.weatherDelayDays || 0}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">
                      Weather Impact Score
                    </dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {analytics.weatherImpactScore?.toFixed(1) || "N/A"}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Critical Issues</dt>
                    <dd className="text-sm font-medium text-red-600">
                      {analytics.totalCriticalIssues || 0}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Average Team Size</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {analytics.averageTeamSize?.toFixed(1) || "N/A"}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Top Issues */}
            {analytics.topIssueCategories &&
              analytics.topIssueCategories.length > 0 && (
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">
                    ⚠️ Top Issue Categories
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analytics.topIssueCategories.map((issue, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-red-100 px-3 py-1 text-sm text-red-800"
                      >
                        {issue}
                      </span>
                    ))}
                  </div>
                </div>
              )}
          </div>
        ) : (
          <AnalyticsChartLoader analytics={analytics} />
        )}
      </div>
    </div>
  );
};

export default Analytics;
