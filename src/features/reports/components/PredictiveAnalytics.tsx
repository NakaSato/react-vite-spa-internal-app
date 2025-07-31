import React, { useState, useEffect, useMemo } from "react";
import { Line, Scatter, Bar } from "react-chartjs-2";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import { DailyReportAnalytics } from "../../../shared/types/project";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface PredictiveInsights {
  completionPrediction: {
    estimatedDate: string;
    confidence: number;
    factorsAnalyzed: string[];
  };
  riskAssessment: {
    riskLevel: "Low" | "Medium" | "High" | "Critical";
    riskFactors: RiskFactor[];
    mitigation: string[];
  };
  resourceOptimization: {
    recommendations: ResourceRecommendation[];
    efficiency: number;
    costImpact: number;
  };
  weatherImpact: {
    productivityCorrelation: number;
    recommendations: string[];
    forecast: WeatherForecast[];
  };
}

interface RiskFactor {
  factor: string;
  severity: number;
  impact: string;
  probability: number;
}

interface ResourceRecommendation {
  resource: string;
  action: "increase" | "decrease" | "reallocate";
  reason: string;
  impact: number;
}

interface WeatherForecast {
  date: string;
  condition: string;
  productivityImpact: number;
  recommendations: string[];
}

interface PredictiveAnalyticsProps {
  analytics: DailyReportAnalytics;
  projectId: string;
  onInsightAction?: (action: string, data: any) => void;
}

const PredictiveAnalytics: React.FC<PredictiveAnalyticsProps> = ({
  analytics,
  projectId,
  onInsightAction,
}) => {
  const [activeView, setActiveView] = useState<
    "completion" | "risk" | "resources" | "weather"
  >("completion");
  const [insights, setInsights] = useState<PredictiveInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const { ref, inView } = useInView({ threshold: 0.1 });

  // Generate predictive insights based on analytics data
  const generateInsights = useMemo(() => {
    if (!analytics) return null;

    // Simulate ML-based predictions (in real implementation, these would come from ML models)
    const completionPrediction = {
      estimatedDate: new Date(
        Date.now() + 45 * 24 * 60 * 60 * 1000
      ).toISOString(),
      confidence: Math.min(
        85 + (analytics.averageProgressPerDay || 0) * 0.1,
        95
      ),
      factorsAnalyzed: [
        "Historical progress patterns",
        "Current team performance",
        "Weather impact analysis",
        "Resource availability",
        "Quality metrics trends",
      ],
    };

    const riskLevel: "Low" | "Medium" | "High" | "Critical" =
      (analytics.averageSafetyScore || 0) < 7
        ? "Critical"
        : (analytics.averageSafetyScore || 0) < 8
          ? "High"
          : (analytics.averageSafetyScore || 0) < 9
            ? "Medium"
            : "Low";

    const riskFactors: RiskFactor[] = [
      {
        factor: "Safety Performance",
        severity: 10 - (analytics.averageSafetyScore || 9),
        impact: "Project delays, compliance issues",
        probability: (analytics.averageSafetyScore || 9) < 8 ? 0.7 : 0.2,
      },
      {
        factor: "Weather Delays",
        severity: Object.keys(analytics.weatherConditionDays || {}).includes(
          "Rainy"
        )
          ? 6
          : 3,
        impact: "Schedule delays, quality issues",
        probability: 0.4,
      },
      {
        factor: "Quality Variations",
        severity: 10 - (analytics.averageQualityScore || 9),
        impact: "Rework requirements, client dissatisfaction",
        probability: (analytics.averageQualityScore || 9) < 8 ? 0.6 : 0.3,
      },
    ];

    const resourceOptimization = {
      recommendations: [
        {
          resource: "Personnel",
          action: "reallocate" as const,
          reason: "Optimize team distribution for peak productivity",
          impact: 15,
        },
        {
          resource: "Equipment",
          action: "increase" as const,
          reason: "Current utilization suggests bottlenecks",
          impact: 22,
        },
      ],
      efficiency: Math.min((analytics.productivityIndex || 0) * 1.2, 100),
      costImpact: -12.5,
    };

    const weatherImpact = {
      productivityCorrelation: 0.75,
      recommendations: [
        "Schedule indoor tasks during predicted rain days",
        "Increase buffer time for weather-sensitive activities",
        "Pre-position equipment before weather changes",
      ],
      forecast: [
        {
          date: new Date(Date.now() + 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          condition: "Sunny",
          productivityImpact: 95,
          recommendations: ["Optimal day for exterior work"],
        },
        {
          date: new Date(Date.now() + 48 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          condition: "Cloudy",
          productivityImpact: 85,
          recommendations: ["Good for most activities"],
        },
        {
          date: new Date(Date.now() + 72 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          condition: "Rainy",
          productivityImpact: 60,
          recommendations: ["Focus on indoor tasks", "Delay electrical work"],
        },
      ],
    };

    return {
      completionPrediction,
      riskAssessment: {
        riskLevel,
        riskFactors,
        mitigation: [
          "Implement additional safety training sessions",
          "Increase weather monitoring frequency",
          "Establish quality checkpoints",
        ],
      },
      resourceOptimization,
      weatherImpact,
    };
  }, [analytics]);

  useEffect(() => {
    if (generateInsights) {
      setInsights(generateInsights);
      setLoading(false);
    }
  }, [generateInsights]);

  const completionChart = useMemo(() => {
    if (!insights) return null;

    const today = new Date();
    const estimatedDate = new Date(insights.completionPrediction.estimatedDate);
    const daysToCompletion = Math.ceil(
      (estimatedDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      labels: Array.from({ length: daysToCompletion }, (_, i) => {
        const date = new Date(today);
        date.setDate(date.getDate() + i);
        return date.toLocaleDateString();
      }),
      datasets: [
        {
          label: "Predicted Progress",
          data: Array.from({ length: daysToCompletion }, (_, i) => {
            const progress =
              (analytics.totalProgressContribution || 0) +
              (i / daysToCompletion) *
                (100 - (analytics.totalProgressContribution || 0));
            return Math.min(progress, 100);
          }),
          borderColor: "rgb(59, 130, 246)",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          tension: 0.4,
        },
        {
          label: "Confidence Interval",
          data: Array.from({ length: daysToCompletion }, (_, i) => {
            const baseProgress =
              (analytics.totalProgressContribution || 0) +
              (i / daysToCompletion) *
                (100 - (analytics.totalProgressContribution || 0));
            return Math.min(baseProgress * 0.9, 100);
          }),
          borderColor: "rgba(59, 130, 246, 0.3)",
          backgroundColor: "rgba(59, 130, 246, 0.05)",
          borderDash: [5, 5],
          tension: 0.4,
        },
      ],
    };
  }, [insights, analytics]);

  const riskScatterChart = useMemo(() => {
    if (!insights) return null;

    return {
      datasets: [
        {
          label: "Risk Factors",
          data: insights.riskAssessment.riskFactors.map((factor) => ({
            x: factor.severity,
            y: factor.probability * 100,
            label: factor.factor,
          })),
          backgroundColor: insights.riskAssessment.riskFactors.map((factor) =>
            factor.severity > 7
              ? "rgba(239, 68, 68, 0.8)"
              : factor.severity > 5
                ? "rgba(245, 158, 11, 0.8)"
                : "rgba(34, 197, 94, 0.8)"
          ),
          borderColor: insights.riskAssessment.riskFactors.map((factor) =>
            factor.severity > 7
              ? "rgb(239, 68, 68)"
              : factor.severity > 5
                ? "rgb(245, 158, 11)"
                : "rgb(34, 197, 94)"
          ),
          pointRadius: 8,
        },
      ],
    };
  }, [insights]);

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="flex min-h-64 items-center justify-center text-center text-gray-500">
        <p>Unable to generate predictive insights. Please check your data.</p>
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <h2 className="mb-2 text-2xl font-bold">🔮 Predictive Analytics</h2>
        <p className="text-blue-100">
          AI-powered insights and forecasting for project optimization
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: "completion", label: "📈 Completion", icon: "📈" },
            { key: "risk", label: "⚠️ Risk Assessment", icon: "⚠️" },
            { key: "resources", label: "🔧 Resources", icon: "🔧" },
            { key: "weather", label: "🌤️ Weather Impact", icon: "🌤️" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveView(tab.key as any)}
              className={`border-b-2 px-1 py-2 text-sm font-medium transition-colors ${
                activeView === tab.key
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeView === "completion" && (
          <motion.div
            key="completion"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Completion Prediction Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-lg border-l-4 border-blue-500 bg-white p-6 shadow-md">
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Estimated Completion
                </h3>
                <p className="mb-1 text-3xl font-bold text-blue-600">
                  {new Date(
                    insights.completionPrediction.estimatedDate
                  ).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  {Math.ceil(
                    (new Date(
                      insights.completionPrediction.estimatedDate
                    ).getTime() -
                      new Date().getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}{" "}
                  days remaining
                </p>
              </div>

              <div className="rounded-lg border-l-4 border-green-500 bg-white p-6 shadow-md">
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Confidence Level
                </h3>
                <p className="mb-1 text-3xl font-bold text-green-600">
                  {insights.completionPrediction.confidence.toFixed(1)}%
                </p>
                <p className="text-sm text-gray-600">Based on current trends</p>
              </div>

              <div className="rounded-lg border-l-4 border-purple-500 bg-white p-6 shadow-md">
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Factors Analyzed
                </h3>
                <p className="mb-1 text-3xl font-bold text-purple-600">
                  {insights.completionPrediction.factorsAnalyzed.length}
                </p>
                <p className="text-sm text-gray-600">Data points considered</p>
              </div>
            </div>

            {/* Completion Chart */}
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Project Completion Forecast
              </h3>
              {completionChart && (
                <Line
                  data={completionChart}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: "top" as const,
                      },
                      title: {
                        display: true,
                        text: "Predicted Progress Over Time",
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                          display: true,
                          text: "Progress (%)",
                        },
                      },
                    },
                  }}
                />
              )}
            </div>

            {/* Factors List */}
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Analysis Factors
              </h3>
              <div className="space-y-3">
                {insights.completionPrediction.factorsAnalyzed.map(
                  (factor, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 rounded-lg bg-gray-50 p-3"
                    >
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                      <span className="text-gray-700">{factor}</span>
                    </div>
                  )
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeView === "risk" && (
          <motion.div
            key="risk"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Risk Level Card */}
            <div className="rounded-lg bg-white p-6 shadow-md">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Overall Risk Level
                </h3>
                <span
                  className={`rounded-full px-3 py-1 text-sm font-medium ${
                    insights.riskAssessment.riskLevel === "Critical"
                      ? "bg-red-100 text-red-800"
                      : insights.riskAssessment.riskLevel === "High"
                        ? "bg-orange-100 text-orange-800"
                        : insights.riskAssessment.riskLevel === "Medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                  }`}
                >
                  {insights.riskAssessment.riskLevel}
                </span>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h4 className="mb-3 font-medium text-gray-900">
                    Risk Factors vs Probability
                  </h4>
                  {riskScatterChart && (
                    <Scatter
                      data={riskScatterChart}
                      options={{
                        responsive: true,
                        plugins: {
                          tooltip: {
                            callbacks: {
                              label: (context: any) => {
                                const point = context.raw;
                                return `${point.label}: Severity ${point.x}, Probability ${point.y}%`;
                              },
                            },
                          },
                        },
                        scales: {
                          x: {
                            title: {
                              display: true,
                              text: "Severity (1-10)",
                            },
                            max: 10,
                          },
                          y: {
                            title: {
                              display: true,
                              text: "Probability (%)",
                            },
                            max: 100,
                          },
                        },
                      }}
                    />
                  )}
                </div>
                <div>
                  <h4 className="mb-3 font-medium text-gray-900">
                    Mitigation Strategies
                  </h4>
                  <div className="space-y-3">
                    {insights.riskAssessment.mitigation.map(
                      (strategy, index) => (
                        <div
                          key={index}
                          className="flex items-start space-x-3 rounded-lg bg-blue-50 p-3"
                        >
                          <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
                            {index + 1}
                          </div>
                          <span className="text-gray-700">{strategy}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Factors Details */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {insights.riskAssessment.riskFactors.map((factor, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="rounded-lg border-l-4 border-orange-500 bg-white p-6 shadow-md"
                >
                  <h4 className="mb-2 font-semibold text-gray-900">
                    {factor.factor}
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Severity:</span>
                      <span className="font-medium text-orange-600">
                        {factor.severity}/10
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Probability:
                      </span>
                      <span className="font-medium text-red-600">
                        {(factor.probability * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="mt-3">
                      <p className="text-sm text-gray-700">{factor.impact}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeView === "resources" && (
          <motion.div
            key="resources"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Resource Optimization Summary */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-lg border-l-4 border-green-500 bg-white p-6 shadow-md">
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Efficiency Potential
                </h3>
                <p className="mb-1 text-3xl font-bold text-green-600">
                  {insights.resourceOptimization.efficiency.toFixed(1)}%
                </p>
                <p className="text-sm text-gray-600">Projected improvement</p>
              </div>

              <div className="rounded-lg border-l-4 border-blue-500 bg-white p-6 shadow-md">
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Cost Impact
                </h3>
                <p className="mb-1 text-3xl font-bold text-blue-600">
                  {insights.resourceOptimization.costImpact > 0 ? "+" : ""}
                  {insights.resourceOptimization.costImpact.toFixed(1)}%
                </p>
                <p className="text-sm text-gray-600">Budget optimization</p>
              </div>

              <div className="rounded-lg border-l-4 border-purple-500 bg-white p-6 shadow-md">
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Recommendations
                </h3>
                <p className="mb-1 text-3xl font-bold text-purple-600">
                  {insights.resourceOptimization.recommendations.length}
                </p>
                <p className="text-sm text-gray-600">Active suggestions</p>
              </div>
            </div>

            {/* Recommendations */}
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Resource Optimization Recommendations
              </h3>
              <div className="space-y-4">
                {insights.resourceOptimization.recommendations.map(
                  (rec, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={`rounded-lg border-l-4 p-4 ${
                        rec.action === "increase"
                          ? "border-green-500 bg-green-50"
                          : rec.action === "decrease"
                            ? "border-red-500 bg-red-50"
                            : "border-blue-500 bg-blue-50"
                      }`}
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">
                          {rec.resource}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`rounded px-2 py-1 text-xs font-medium ${
                              rec.action === "increase"
                                ? "bg-green-100 text-green-800"
                                : rec.action === "decrease"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {rec.action.toUpperCase()}
                          </span>
                          <span className="text-sm font-medium text-gray-600">
                            +{rec.impact}% impact
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-700">{rec.reason}</p>
                      {onInsightAction && (
                        <button
                          onClick={() =>
                            onInsightAction("resource_optimization", rec)
                          }
                          className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-500"
                        >
                          Apply Recommendation →
                        </button>
                      )}
                    </motion.div>
                  )
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeView === "weather" && (
          <motion.div
            key="weather"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Weather Impact Summary */}
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Weather Impact Analysis
              </h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h4 className="mb-2 font-medium text-gray-900">
                    Productivity Correlation
                  </h4>
                  <div className="flex items-center space-x-3">
                    <div className="h-3 w-full rounded-full bg-gray-200">
                      <div
                        className="h-3 rounded-full bg-blue-600"
                        style={{
                          width: `${
                            insights.weatherImpact.productivityCorrelation * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                    <span className="font-medium text-blue-600">
                      {(
                        insights.weatherImpact.productivityCorrelation * 100
                      ).toFixed(0)}
                      %
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    Weather conditions strongly influence productivity
                  </p>
                </div>
                <div>
                  <h4 className="mb-2 font-medium text-gray-900">
                    General Recommendations
                  </h4>
                  <div className="space-y-2">
                    {insights.weatherImpact.recommendations.map(
                      (rec, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <div className="mt-2 h-2 w-2 rounded-full bg-blue-500"></div>
                          <span className="text-sm text-gray-700">{rec}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Weather Forecast */}
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                3-Day Weather Forecast & Impact
              </h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {insights.weatherImpact.forecast.map((day, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`rounded-lg border-2 p-4 ${
                      day.productivityImpact > 90
                        ? "border-green-200 bg-green-50"
                        : day.productivityImpact > 70
                          ? "border-yellow-200 bg-yellow-50"
                          : "border-red-200 bg-red-50"
                    }`}
                  >
                    <div className="mb-3 text-center">
                      <p className="font-medium text-gray-900">
                        {new Date(day.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      <p className="mb-1 text-2xl">
                        {day.condition === "Sunny"
                          ? "☀️"
                          : day.condition === "Cloudy"
                            ? "☁️"
                            : "🌧️"}
                      </p>
                      <p className="text-sm text-gray-600">{day.condition}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Productivity:
                        </span>
                        <span
                          className={`font-medium ${
                            day.productivityImpact > 90
                              ? "text-green-600"
                              : day.productivityImpact > 70
                                ? "text-yellow-600"
                                : "text-red-600"
                          }`}
                        >
                          {day.productivityImpact}%
                        </span>
                      </div>
                      <div>
                        <p className="mb-1 text-xs text-gray-600">
                          Recommendations:
                        </p>
                        {day.recommendations.map((rec, recIndex) => (
                          <p key={recIndex} className="text-xs text-gray-700">
                            • {rec}
                          </p>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PredictiveAnalytics;
