import React from "react";
import { ProjectEntity } from "../../../shared/types/project-management";

interface KPIDashboardProps {
  project: ProjectEntity;
}

interface KPICardProps {
  title: string;
  value: number;
  target: number;
  format: "ratio" | "percentage" | "score";
  trend: "up" | "down" | "stable";
  description?: string;
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  target,
  format,
  trend,
  description,
}) => {
  const formatValue = (val: number, fmt: string) => {
    switch (fmt) {
      case "ratio":
        return val.toFixed(2);
      case "percentage":
        return `${val}%`;
      case "score":
        return val.toString();
      default:
        return val.toString();
    }
  };

  const getStatusColor = () => {
    const performance = value / target;
    if (performance >= 1.0)
      return "text-green-600 bg-green-50 border-green-200";
    if (performance >= 0.8) return "text-blue-600 bg-blue-50 border-blue-200";
    if (performance >= 0.6)
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return "📈";
      case "down":
        return "📉";
      case "stable":
        return "➡️";
      default:
        return "📊";
    }
  };

  const performance = (value / target) * 100;

  return (
    <div className={`rounded-lg border p-4 ${getStatusColor()}`}>
      <div className="mb-2 flex items-center justify-between">
        <div className="text-xs font-medium uppercase tracking-wide">
          {title}
        </div>
        <span className="text-lg">{getTrendIcon()}</span>
      </div>

      <div className="mb-1 text-2xl font-bold">
        {formatValue(value, format)}
      </div>

      <div className="mb-2 text-xs">Target: {formatValue(target, format)}</div>

      <div className="mb-2 h-2 w-full rounded-full bg-white">
        <div
          className="h-2 rounded-full bg-current opacity-60"
          style={{ width: `${Math.min(performance, 100)}%` }}
        ></div>
      </div>

      {description && <div className="text-xs opacity-75">{description}</div>}
    </div>
  );
};

export const KPIDashboard: React.FC<KPIDashboardProps> = ({ project }) => {
  const kpis = [
    {
      title: "Schedule Performance Index",
      value: 0.95,
      target: 1.0,
      format: "ratio" as const,
      trend: "down" as const,
      description: "Ratio of work performed vs planned",
    },
    {
      title: "On-Time Delivery Rate",
      value: 89,
      target: 95,
      format: "percentage" as const,
      trend: "stable" as const,
      description: "Percentage of milestones met on time",
    },
    {
      title: "Resource Utilization",
      value: 78,
      target: 85,
      format: "percentage" as const,
      trend: "up" as const,
      description: "Efficiency of resource allocation",
    },
    {
      title: "Quality Score",
      value: 92,
      target: 90,
      format: "score" as const,
      trend: "up" as const,
      description: "Overall project quality metrics",
    },
  ];

  const performanceData = [
    { metric: "Cost Performance", current: 95, target: 100, variance: -5 },
    { metric: "Schedule Performance", current: 89, target: 95, variance: -6 },
    { metric: "Quality Performance", current: 102, target: 100, variance: +2 },
    { metric: "Safety Performance", current: 98, target: 100, variance: -2 },
  ];

  const riskIndicators = [
    { category: "Schedule", level: "Medium", count: 3, trend: "increasing" },
    { category: "Budget", level: "Low", count: 1, trend: "stable" },
    { category: "Quality", level: "Low", count: 0, trend: "decreasing" },
    { category: "Resources", level: "High", count: 2, trend: "increasing" },
  ];

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        {kpis.map((kpi, index) => (
          <KPICard
            key={index}
            title={kpi.title}
            value={kpi.value}
            target={kpi.target}
            format={kpi.format}
            trend={kpi.trend}
            description={kpi.description}
          />
        ))}
      </div>

      {/* Performance Overview */}
      <div className="rounded-lg border bg-white shadow-sm">
        <div className="border-b p-6">
          <h3 className="text-lg font-medium text-gray-900">
            Performance Overview
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {performanceData.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div>
                  <div className="font-medium text-gray-900">{item.metric}</div>
                  <div className="text-sm text-gray-600">
                    Target: {item.target}% • Current: {item.current}%
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`text-lg font-bold ${
                      item.variance >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {item.variance > 0 ? "+" : ""}
                    {item.variance}%
                  </div>
                  <div className="mt-1 h-2 w-16 rounded-full bg-gray-200">
                    <div
                      className={`h-2 rounded-full ${
                        item.current >= item.target
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${Math.min(item.current, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Advanced analytics charts placeholder */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Performance Trend Chart */}
        <div className="rounded-lg border bg-white shadow-sm">
          <div className="border-b p-4">
            <h3 className="text-lg font-medium text-gray-900">
              Performance Trends
            </h3>
          </div>
          <div className="p-6">
            <div className="py-8 text-center text-gray-500">
              <div className="mb-4 text-4xl">📊</div>
              <h4 className="mb-2 text-lg font-medium text-gray-900">
                Performance Chart
              </h4>
              <p className="text-sm">
                Interactive performance trend visualization will be implemented
                in Phase 5.
              </p>
              <div className="mt-4 text-xs text-gray-400">
                Features: Multi-metric comparison, Historical trends,
                Forecasting
              </div>
            </div>
          </div>
        </div>

        {/* Risk Analysis */}
        <div className="rounded-lg border bg-white shadow-sm">
          <div className="border-b p-4">
            <h3 className="text-lg font-medium text-gray-900">Risk Analysis</h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {riskIndicators.map((risk, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center space-x-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getRiskColor(
                        risk.level
                      )}`}
                    >
                      {risk.level}
                    </span>
                    <div>
                      <div className="font-medium text-gray-900">
                        {risk.category}
                      </div>
                      <div className="text-sm text-gray-600">
                        {risk.count} active risks
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {risk.trend === "increasing"
                      ? "📈"
                      : risk.trend === "decreasing"
                        ? "📉"
                        : "➡️"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Additional Charts Placeholders */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Burndown Chart */}
        <div className="rounded-lg border bg-white shadow-sm">
          <div className="border-b p-4">
            <h3 className="text-lg font-medium text-gray-900">
              Burndown Chart
            </h3>
          </div>
          <div className="p-6">
            <div className="py-8 text-center text-gray-500">
              <div className="mb-4 text-4xl">📉</div>
              <h4 className="mb-2 text-lg font-medium text-gray-900">
                Burndown Visualization
              </h4>
              <p className="text-sm">
                Progress burndown chart will be implemented in Phase 5.
              </p>
            </div>
          </div>
        </div>

        {/* Resource Allocation Chart */}
        <div className="rounded-lg border bg-white shadow-sm">
          <div className="border-b p-4">
            <h3 className="text-lg font-medium text-gray-900">
              Resource Allocation
            </h3>
          </div>
          <div className="p-6">
            <div className="py-8 text-center text-gray-500">
              <div className="mb-4 text-4xl">👥</div>
              <h4 className="mb-2 text-lg font-medium text-gray-900">
                Resource Distribution
              </h4>
              <p className="text-sm">
                Resource allocation visualization will be implemented in Phase
                5.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Export and Reporting */}
      <div className="rounded-lg border bg-white shadow-sm">
        <div className="border-b p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              Reports & Export
            </h3>
            <div className="flex space-x-2">
              <button className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                📊 Export to Excel
              </button>
              <button className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                📄 Generate PDF
              </button>
              <button className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                📧 Schedule Report
              </button>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="py-4 text-center text-gray-500">
            <p className="text-sm">
              Report generation and export functionality will be implemented in
              Phase 5.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
