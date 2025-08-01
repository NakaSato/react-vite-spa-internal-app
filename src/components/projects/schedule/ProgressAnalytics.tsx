import React from "react";
import { ProjectEntity } from "../../../shared/types/project-management";

interface ProgressAnalyticsProps {
  project: ProjectEntity;
  showDetailed?: boolean;
}

export const ProgressAnalytics: React.FC<ProgressAnalyticsProps> = ({
  project,
  showDetailed = true,
}) => {
  // Calculate progress metrics
  const overallProgress = Math.round(project.overallCompletion * 100);

  const phaseProgress = [
    { name: "Planning & Permitting", progress: 100, weight: 15 },
    { name: "Procurement & Logistics", progress: 85, weight: 25 },
    { name: "Construction & Installation", progress: 45, weight: 50 },
    { name: "Testing & Handover", progress: 0, weight: 10 },
  ];

  const completionForecast = {
    original: project.plannedEndDate,
    current: new Date(
      project.plannedEndDate.getTime() + 7 * 24 * 60 * 60 * 1000
    ), // 7 days delay
    confidence: 85,
  };

  const progressTrends = [
    { date: "2024-01-01", planned: 10, actual: 8 },
    { date: "2024-01-15", planned: 20, actual: 18 },
    { date: "2024-02-01", planned: 35, actual: 32 },
    { date: "2024-02-15", planned: 50, actual: 45 },
    { date: "2024-03-01", planned: 65, actual: 67 },
    { date: "2024-03-15", planned: 75, actual: 67 },
  ];

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 60) return "bg-blue-500";
    if (progress >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getVarianceStatus = (planned: number, actual: number) => {
    const variance = actual - planned;
    if (variance >= 0)
      return { status: "ahead", color: "text-green-600", icon: "📈" };
    if (variance > -5)
      return { status: "on_track", color: "text-blue-600", icon: "📊" };
    return { status: "behind", color: "text-red-600", icon: "📉" };
  };

  return (
    <div className="space-y-6">
      {/* Progress overview cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Overall Progress */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              Overall Progress
            </h3>
            <span className="text-2xl">📊</span>
          </div>
          <div className="mb-2 text-3xl font-bold text-blue-600">
            {overallProgress}%
          </div>
          <div className="mb-3 h-3 w-full rounded-full bg-gray-200">
            <div
              className={`h-3 rounded-full ${getProgressColor(
                overallProgress
              )}`}
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
          <div className="text-sm text-gray-600">
            Target: 75% • Variance: +{overallProgress - 75}%
          </div>
        </div>

        {/* Phase Progress */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              Phase Progress
            </h3>
            <span className="text-2xl">🏗️</span>
          </div>
          <div className="space-y-3">
            {phaseProgress.map((phase, index) => (
              <div key={index}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-gray-700">{phase.name}</span>
                  <span className="font-medium">{phase.progress}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div
                    className={`h-2 rounded-full ${getProgressColor(
                      phase.progress
                    )}`}
                    style={{ width: `${phase.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Completion Forecast */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Forecast</h3>
            <span className="text-2xl">🔮</span>
          </div>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-600">Original Target</div>
              <div className="font-medium">
                {completionForecast.original.toLocaleDateString()}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Current Forecast</div>
              <div className="font-medium text-yellow-600">
                {completionForecast.current.toLocaleDateString()}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Confidence</div>
              <div className="flex items-center space-x-2">
                <div className="font-medium">
                  {completionForecast.confidence}%
                </div>
                <div className="h-2 flex-1 rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-blue-500"
                    style={{ width: `${completionForecast.confidence}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced progress dashboard */}
      {showDetailed && (
        <div className="rounded-lg border bg-white shadow-sm">
          <div className="border-b p-6">
            <h3 className="text-lg font-medium text-gray-900">
              Detailed Progress Analysis
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Progress by Phase */}
              <div>
                <h4 className="text-md mb-4 font-medium text-gray-900">
                  Progress Breakdown
                </h4>
                <div className="space-y-4">
                  {phaseProgress.map((phase, index) => (
                    <div key={index} className="rounded-lg border p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-medium text-gray-900">
                          {phase.name}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">
                            Weight: {phase.weight}%
                          </span>
                          <span className="font-bold text-gray-900">
                            {phase.progress}%
                          </span>
                        </div>
                      </div>
                      <div className="mb-2 h-3 w-full rounded-full bg-gray-200">
                        <div
                          className={`h-3 rounded-full ${getProgressColor(
                            phase.progress
                          )}`}
                          style={{ width: `${phase.progress}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500">
                        Contribution:{" "}
                        {Math.round((phase.progress * phase.weight) / 100)}% of
                        total
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress Health Indicators */}
              <div>
                <h4 className="text-md mb-4 font-medium text-gray-900">
                  Health Indicators
                </h4>
                <div className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-medium text-gray-900">
                        Schedule Variance
                      </span>
                      <span className="font-bold text-red-600">-8%</span>
                    </div>
                    <div className="mb-2 text-sm text-gray-600">
                      Behind schedule by 8 percentage points
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-200">
                      <div
                        className="h-2 rounded-full bg-red-500"
                        style={{ width: "8%" }}
                      ></div>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-medium text-gray-900">
                        Velocity Trend
                      </span>
                      <span className="font-bold text-yellow-600">
                        Declining
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Progress rate has slowed in recent weeks
                    </div>
                  </div>

                  <div className="rounded-lg border p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-medium text-gray-900">
                        Risk Level
                      </span>
                      <span className="font-bold text-yellow-600">Medium</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Monitor critical path activities closely
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress trends and forecasting */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Progress Trend Chart Placeholder */}
        <div className="rounded-lg border bg-white shadow-sm">
          <div className="border-b p-4">
            <h3 className="text-lg font-medium text-gray-900">
              Progress Trends
            </h3>
          </div>
          <div className="p-6">
            <div className="py-8 text-center text-gray-500">
              <div className="mb-4 text-4xl">📈</div>
              <h4 className="mb-2 text-lg font-medium text-gray-900">
                Trend Chart Coming Soon
              </h4>
              <p className="text-sm">
                Interactive progress trend visualization will be implemented in
                Phase 4.
              </p>
              <div className="mt-4 text-xs text-gray-400">
                Features: Planned vs Actual, Velocity tracking, Burndown charts
              </div>
            </div>
          </div>
        </div>

        {/* Completion Forecast */}
        <div className="rounded-lg border bg-white shadow-sm">
          <div className="border-b p-4">
            <h3 className="text-lg font-medium text-gray-900">
              Completion Forecast
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-blue-50 p-3">
                <div>
                  <div className="font-medium text-blue-900">
                    Best Case Scenario
                  </div>
                  <div className="text-sm text-blue-700">
                    All tasks completed on time
                  </div>
                </div>
                <div className="font-bold text-blue-900">
                  {project.plannedEndDate.toLocaleDateString()}
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-yellow-50 p-3">
                <div>
                  <div className="font-medium text-yellow-900">Most Likely</div>
                  <div className="text-sm text-yellow-700">
                    Current trajectory
                  </div>
                </div>
                <div className="font-bold text-yellow-900">
                  {completionForecast.current.toLocaleDateString()}
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-red-50 p-3">
                <div>
                  <div className="font-medium text-red-900">
                    Worst Case Scenario
                  </div>
                  <div className="text-sm text-red-700">
                    With potential delays
                  </div>
                </div>
                <div className="font-bold text-red-900">
                  {new Date(
                    completionForecast.current.getTime() +
                      14 * 24 * 60 * 60 * 1000
                  ).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
