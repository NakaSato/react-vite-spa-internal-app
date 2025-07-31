import React, { useState, useEffect } from "react";
import {
  ProjectEntity,
  ProgressCalculation,
  PhaseCompletion,
  ProjectHealth,
  ActivityStatus,
} from "../../shared/types/project-management";
import { ProgressCalculationEngine } from "../../shared/utils/progressCalculation";

interface ProgressDashboardProps {
  project: ProjectEntity;
  onUpdateProgress?: (activityId: string, percentComplete: number) => void;
}

const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  project,
  onUpdateProgress,
}) => {
  const [progressReport, setProgressReport] =
    useState<ProgressCalculation | null>(null);
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);

  useEffect(() => {
    const report = ProgressCalculationEngine.generateProgressReport(project);
    setProgressReport(report);
  }, [project]);

  if (!progressReport) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const getHealthStatusColor = (status: ProjectHealth["status"]) => {
    switch (status) {
      case "healthy":
        return "text-green-600 bg-green-100";
      case "at_risk":
        return "text-yellow-600 bg-yellow-100";
      case "critical":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getActivityStatusColor = (status: ActivityStatus) => {
    switch (status) {
      case ActivityStatus.COMPLETED:
        return "bg-green-500";
      case ActivityStatus.IN_PROGRESS:
        return "bg-blue-500";
      case ActivityStatus.OVERDUE:
        return "bg-red-500";
      case ActivityStatus.BLOCKED:
        return "bg-orange-500";
      default:
        return "bg-gray-300";
    }
  };

  const formatPercentage = (value: number) => `${(value * 100).toFixed(1)}%`;

  return (
    <div className="space-y-8">
      {/* Overall Progress Header */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="mb-2 text-3xl font-bold">{project.projectName}</h2>
            <p className="text-lg text-blue-100">
              {project.projectOwner} • {project.mainContractor}
            </p>
          </div>
          <div className="text-right">
            <div className="mb-2 text-5xl font-bold">
              {formatPercentage(progressReport.overallCompletion)}
            </div>
            <div className="text-blue-100">Overall Progress</div>
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="mt-6">
          <div className="mb-2 flex justify-between text-sm text-blue-100">
            <span>Project Completion</span>
            <span>
              Updated: {progressReport.calculatedAt.toLocaleDateString()}
            </span>
          </div>
          <div className="h-4 w-full rounded-full bg-white/20">
            <div
              className="h-4 rounded-full bg-white transition-all duration-500 ease-out"
              style={{ width: `${progressReport.overallCompletion * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Project Health Status */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <h3 className="mb-4 flex items-center text-xl font-bold">
              📊 Project Health Overview
            </h3>

            <div className="mb-4 flex items-center">
              <span
                className={`rounded-full px-4 py-2 text-sm font-medium ${getHealthStatusColor(
                  progressReport.projectHealth.status
                )}`}
              >
                {progressReport.projectHealth.status.toUpperCase()}
              </span>
              <span className="ml-4 text-gray-600">
                Schedule Variance:{" "}
                {progressReport.projectHealth.scheduleVariance > 0 ? "+" : ""}
                {progressReport.projectHealth.scheduleVariance.toFixed(1)} days
              </span>
            </div>

            {progressReport.projectHealth.riskFactors.length > 0 && (
              <div className="mb-4">
                <h4 className="mb-2 font-semibold text-red-600">
                  ⚠️ Risk Factors:
                </h4>
                <ul className="space-y-1">
                  {progressReport.projectHealth.riskFactors.map(
                    (risk, index) => (
                      <li
                        key={index}
                        className="flex items-center text-sm text-red-600"
                      >
                        <span className="mr-2 h-2 w-2 rounded-full bg-red-400"></span>
                        {risk}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}

            {progressReport.projectHealth.recommendations.length > 0 && (
              <div>
                <h4 className="mb-2 font-semibold text-blue-600">
                  💡 Recommendations:
                </h4>
                <ul className="space-y-1">
                  {progressReport.projectHealth.recommendations.map(
                    (rec, index) => (
                      <li
                        key={index}
                        className="flex items-center text-sm text-blue-600"
                      >
                        <span className="mr-2 h-2 w-2 rounded-full bg-blue-400"></span>
                        {rec}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-lg">
          <h3 className="mb-4 text-xl font-bold">🎯 Critical Path</h3>
          {progressReport.criticalPath.length > 0 ? (
            <div className="space-y-2">
              <p className="mb-3 text-sm text-gray-600">
                {progressReport.criticalPath.length} activities on critical path
              </p>
              {progressReport.criticalPath.slice(0, 5).map((activityId) => {
                const activity = project.phases
                  .flatMap((p) => p.activities)
                  .find((a) => a.activityId === activityId);

                return activity ? (
                  <div
                    key={activityId}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="mr-2 truncate">
                      {activity.activityName}
                    </span>
                    <span className="font-medium text-red-600">
                      {formatPercentage(activity.percentComplete)}
                    </span>
                  </div>
                ) : null;
              })}
              {progressReport.criticalPath.length > 5 && (
                <p className="text-xs text-gray-500">
                  +{progressReport.criticalPath.length - 5} more activities
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No critical path calculated</p>
          )}
        </div>
      </div>

      {/* Phase Progress Details */}
      <div className="rounded-xl bg-white p-6 shadow-lg">
        <h3 className="mb-6 text-xl font-bold">📈 Phase Progress Breakdown</h3>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {progressReport.phaseCompletions.map((phaseCompletion) => (
            <div
              key={phaseCompletion.phaseId}
              className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${
                selectedPhase === phaseCompletion.phaseId
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() =>
                setSelectedPhase(
                  selectedPhase === phaseCompletion.phaseId
                    ? null
                    : phaseCompletion.phaseId
                )
              }
            >
              <div className="mb-2 flex items-start justify-between">
                <h4 className="text-sm font-semibold">
                  {phaseCompletion.phaseName}
                </h4>
                <span
                  className={`rounded px-2 py-1 text-xs ${
                    phaseCompletion.onSchedule
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {phaseCompletion.onSchedule ? "On Track" : "Behind"}
                </span>
              </div>

              <div className="mb-2">
                <div className="mb-1 flex justify-between text-xs text-gray-600">
                  <span>Progress</span>
                  <span>{formatPercentage(phaseCompletion.completion)}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${phaseCompletion.completion * 100}%` }}
                  />
                </div>
              </div>

              <div className="text-xs text-gray-600">
                <div>Weight: {formatPercentage(phaseCompletion.weight)}</div>
                <div>
                  Contribution:{" "}
                  {formatPercentage(phaseCompletion.contributionToOverall)}
                </div>
                {!phaseCompletion.onSchedule && (
                  <div className="font-medium text-red-600">
                    {Math.abs(phaseCompletion.daysAhead)} days{" "}
                    {phaseCompletion.daysAhead < 0 ? "behind" : "ahead"}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Selected Phase Activities */}
        {selectedPhase && (
          <div className="border-t pt-6">
            {(() => {
              const phase = project.phases.find(
                (p) => p.phaseId === selectedPhase
              );
              if (!phase) return null;

              return (
                <div>
                  <h4 className="mb-4 font-semibold">
                    {phase.phaseName} - Activities
                  </h4>
                  <div className="space-y-3">
                    {phase.activities.map((activity) => (
                      <div
                        key={activity.activityId}
                        className="flex items-center justify-between rounded-lg bg-gray-50 p-4"
                      >
                        <div className="flex-1">
                          <div className="mb-2 flex items-center">
                            <div
                              className={`mr-3 h-3 w-3 rounded-full ${getActivityStatusColor(
                                activity.status
                              )}`}
                            />
                            <span className="font-medium">
                              {activity.activityName}
                            </span>
                            {activity.isOnCriticalPath && (
                              <span className="ml-2 rounded-full bg-red-100 px-2 py-1 text-xs text-red-600">
                                Critical
                              </span>
                            )}
                          </div>

                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>Duration: {activity.duration} days</span>
                            <span>
                              Start: {activity.startDate.toLocaleDateString()}
                            </span>
                            <span>
                              End: {activity.endDate.toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="font-semibold">
                              {formatPercentage(activity.percentComplete)}
                            </div>
                            <div className="mt-1 h-2 w-24 rounded-full bg-gray-200">
                              <div
                                className={`h-2 rounded-full transition-all duration-300 ${
                                  activity.status === ActivityStatus.COMPLETED
                                    ? "bg-green-500"
                                    : activity.status === ActivityStatus.OVERDUE
                                      ? "bg-red-500"
                                      : "bg-blue-500"
                                }`}
                                style={{
                                  width: `${activity.percentComplete * 100}%`,
                                }}
                              />
                            </div>
                          </div>

                          {onUpdateProgress &&
                            activity.status !== ActivityStatus.COMPLETED && (
                              <div className="flex items-center space-x-2">
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={activity.percentComplete * 100}
                                  onChange={(e) =>
                                    onUpdateProgress(
                                      activity.activityId,
                                      Number(e.target.value) / 100
                                    )
                                  }
                                  className="w-20"
                                />
                              </div>
                            )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressDashboard;
