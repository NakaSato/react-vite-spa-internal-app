import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from "chart.js";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import { DailyReportAnalytics, TopPerformer } from "@shared/types/project";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface EnhancedAnalyticsProps {
  analytics: DailyReportAnalytics;
  projectId: string;
}

const EnhancedAnalytics: React.FC<EnhancedAnalyticsProps> = ({
  analytics,
  projectId,
}) => {
  const [chartData, setChartData] = useState<any>(null);
  const [activeChart, setActiveChart] = useState<
    "trends" | "performance" | "weather"
  >("trends");

  useEffect(() => {
    prepareChartData();
  }, [analytics]);

  const prepareChartData = () => {
    // Prepare trend data
    const trendData = {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      datasets: [
        {
          label: "Hours Worked",
          data: [40, 42, 38, 45],
          borderColor: "rgb(59, 130, 246)",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          tension: 0.1,
        },
        {
          label: "Safety Score",
          data: [8.5, 9.0, 8.8, 9.2],
          borderColor: "rgb(34, 197, 94)",
          backgroundColor: "rgba(34, 197, 94, 0.1)",
          tension: 0.1,
          yAxisID: "y1",
        },
      ],
    };

    // Prepare performance data
    const performanceData = {
      labels: ["Safety Score", "Quality Score", "Productivity"],
      datasets: [
        {
          data: [
            analytics.averageSafetyScore,
            analytics.averageQualityScore,
            analytics.productivityIndex,
          ],
          backgroundColor: [
            "rgba(34, 197, 94, 0.8)",
            "rgba(59, 130, 246, 0.8)",
            "rgba(168, 85, 247, 0.8)",
          ],
          borderColor: [
            "rgba(34, 197, 94, 1)",
            "rgba(59, 130, 246, 1)",
            "rgba(168, 85, 247, 1)",
          ],
          borderWidth: 2,
        },
      ],
    };

    // Prepare weather impact data
    const weatherData = {
      labels: Object.keys(analytics.weatherConditionDays || {}),
      datasets: [
        {
          label: "Days",
          data: Object.values(analytics.weatherConditionDays || {}),
          backgroundColor: [
            "rgba(251, 191, 36, 0.8)",
            "rgba(59, 130, 246, 0.8)",
            "rgba(107, 114, 128, 0.8)",
            "rgba(34, 197, 94, 0.8)",
          ],
          borderColor: [
            "rgba(251, 191, 36, 1)",
            "rgba(59, 130, 246, 1)",
            "rgba(107, 114, 128, 1)",
            "rgba(34, 197, 94, 1)",
          ],
          borderWidth: 2,
        },
      ],
    };

    setChartData({
      trends: trendData,
      performance: performanceData,
      weather: weatherData,
    });
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
      },
      y1: {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
    },
  };

  if (!chartData) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Chart Navigation */}
      <div className="flex space-x-1 rounded-lg bg-gray-100 p-1">
        <button
          onClick={() => setActiveChart("trends")}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            activeChart === "trends"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          📈 Trends
        </button>
        <button
          onClick={() => setActiveChart("performance")}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            activeChart === "performance"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          🎯 Performance
        </button>
        <button
          onClick={() => setActiveChart("weather")}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            activeChart === "weather"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          🌤️ Weather Impact
        </button>
      </div>

      {/* Chart Display */}
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <div className="h-96">
          {activeChart === "trends" && (
            <div>
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Performance Trends Over Time
              </h3>
              <Line data={chartData.trends} options={chartOptions} />
            </div>
          )}

          {activeChart === "performance" && (
            <div>
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Current Performance Metrics
              </h3>
              <Doughnut
                data={chartData.performance}
                options={doughnutOptions}
              />
            </div>
          )}

          {activeChart === "weather" && (
            <div>
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Weather Conditions Distribution
              </h3>
              <Bar data={chartData.weather} options={doughnutOptions} />
            </div>
          )}
        </div>
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">
                Productivity Trend
              </p>
              <p className="text-2xl font-bold text-blue-900">
                {analytics.productivityIndex > 100 ? "↗️" : "↘️"}
                {analytics.productivityIndex.toFixed(1)}%
              </p>
            </div>
            <div className="rounded-full bg-blue-200 p-3">
              <span className="text-2xl">📊</span>
            </div>
          </div>
          <p className="mt-2 text-sm text-blue-700">
            {analytics.productivityIndex > 100
              ? "Above average productivity"
              : "Below average productivity"}
          </p>
        </div>

        <div className="rounded-lg bg-gradient-to-br from-green-50 to-green-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">
                Safety Performance
              </p>
              <p className="text-2xl font-bold text-green-900">
                {analytics.averageSafetyScore.toFixed(1)}/10
              </p>
            </div>
            <div className="rounded-full bg-green-200 p-3">
              <span className="text-2xl">🛡️</span>
            </div>
          </div>
          <p className="mt-2 text-sm text-green-700">
            {analytics.averageSafetyScore >= 8
              ? "Excellent safety record"
              : "Needs safety improvement"}
          </p>
        </div>

        <div className="rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">
                Weather Impact
              </p>
              <p className="text-2xl font-bold text-orange-900">
                {analytics.weatherDelayDays} days
              </p>
            </div>
            <div className="rounded-full bg-orange-200 p-3">
              <span className="text-2xl">🌦️</span>
            </div>
          </div>
          <p className="mt-2 text-sm text-orange-700">
            {analytics.weatherDelayDays > 5
              ? "High weather impact"
              : "Low weather impact"}
          </p>
        </div>
      </div>

      {/* Team Performance Rankings */}
      {analytics.topPerformers && analytics.topPerformers.length > 0 && (
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            🏆 Top Performers
          </h3>
          <div className="space-y-3">
            {analytics.topPerformers
              .slice(0, 5)
              .map((performer: TopPerformer, index: number) => (
                <div
                  key={performer.userId}
                  className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full font-bold text-white ${
                        index === 0
                          ? "bg-yellow-500"
                          : index === 1
                            ? "bg-gray-400"
                            : index === 2
                              ? "bg-amber-600"
                              : "bg-blue-500"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {performer.name || "Unknown"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {performer.averageHoursPerDay.toFixed(1)}h/day • Safety:{" "}
                        {performer.averageSafetyScore.toFixed(1)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600">
                      {performer.productivityScore.toFixed(1)}
                    </p>
                    <p className="text-xs text-gray-500">Score</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          💡 Smart Recommendations
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-white p-4">
            <h4 className="mb-2 font-medium text-purple-600">Productivity</h4>
            <p className="text-sm text-gray-700">
              {analytics.productivityIndex > 100
                ? "Maintain current momentum. Consider sharing best practices with other teams."
                : "Focus on workflow optimization. Review recent successful reports for insights."}
            </p>
          </div>
          <div className="rounded-lg bg-white p-4">
            <h4 className="mb-2 font-medium text-blue-600">Schedule</h4>
            <p className="text-sm text-gray-700">
              {analytics.daysAheadBehindSchedule > 0
                ? "Project is ahead of schedule. Good opportunity to focus on quality improvements."
                : "Project is behind schedule. Consider resource reallocation or timeline adjustment."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedAnalytics;
