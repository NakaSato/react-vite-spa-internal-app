import React from "react";
import { ProjectEntity } from "../../../shared/types/project-management";

interface ScheduleOverviewProps {
  project: ProjectEntity;
  criticalPath?: string[];
  onTaskUpdate?: (taskId: string, updates: any) => void;
}

export const ScheduleOverview: React.FC<ScheduleOverviewProps> = ({
  project,
  criticalPath = [],
  onTaskUpdate,
}) => {
  // Calculate project health metrics
  const scheduleHealth = {
    status:
      project.overallCompletion > 0.8
        ? "healthy"
        : project.overallCompletion > 0.4
          ? "warning"
          : "critical",
    criticalTasks: criticalPath.length,
    completion: Math.round(project.overallCompletion * 100),
    daysRemaining: Math.ceil(
      (project.plannedEndDate.getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24)
    ),
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-green-50 border-green-200 text-green-800";
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "critical":
        return "bg-red-50 border-red-200 text-red-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Project health status cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-4">
        <div
          className={`rounded-lg border p-4 ${getStatusColor(
            scheduleHealth.status
          )}`}
        >
          <div className="font-medium">Schedule Health</div>
          <div className="text-2xl font-bold capitalize">
            {scheduleHealth.status}
          </div>
        </div>
        <div
          className={`rounded-lg border p-4 ${
            scheduleHealth.criticalTasks > 5
              ? "border-red-200 bg-red-50 text-red-800"
              : scheduleHealth.criticalTasks > 0
                ? "border-yellow-200 bg-yellow-50 text-yellow-800"
                : "border-green-200 bg-green-50 text-green-800"
          }`}
        >
          <div className="font-medium">Critical Tasks</div>
          <div className="text-2xl font-bold">
            {scheduleHealth.criticalTasks}
          </div>
        </div>
        <div
          className={`rounded-lg border p-4 ${
            scheduleHealth.completion >= 80
              ? "border-green-200 bg-green-50 text-green-800"
              : scheduleHealth.completion >= 40
                ? "border-yellow-200 bg-yellow-50 text-yellow-800"
                : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          <div className="font-medium">Completion</div>
          <div className="text-2xl font-bold">{scheduleHealth.completion}%</div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-gray-800">
          <div className="font-medium">Days Remaining</div>
          <div className="text-2xl font-bold">
            {Math.max(0, scheduleHealth.daysRemaining)}
          </div>
        </div>
      </div>

      {/* Interactive Gantt Chart Placeholder */}
      <div className="rounded-lg border bg-white shadow-sm">
        <div className="border-b p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              Project Timeline
            </h3>
            <div className="flex space-x-2">
              <button className="rounded-md border px-3 py-1 text-sm hover:bg-gray-50">
                Days
              </button>
              <button className="rounded-md border bg-blue-50 px-3 py-1 text-sm text-blue-600">
                Weeks
              </button>
              <button className="rounded-md border px-3 py-1 text-sm hover:bg-gray-50">
                Months
              </button>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="py-12 text-center text-gray-500">
            <div className="mb-4 text-4xl">📊</div>
            <h4 className="mb-2 text-lg font-medium text-gray-900">
              Gantt Chart Coming Soon
            </h4>
            <p className="text-sm">
              Interactive timeline visualization with critical path analysis
              will be implemented in Phase 2.
            </p>
            <div className="mt-4 text-xs text-gray-400">
              Features: Drag-and-drop scheduling, dependency management,
              resource allocation
            </div>
          </div>
        </div>
      </div>

      {/* Critical path and milestones */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Critical Path View */}
        <div className="rounded-lg border bg-white shadow-sm">
          <div className="border-b p-4">
            <h3 className="text-lg font-medium text-gray-900">Critical Path</h3>
          </div>
          <div className="p-4">
            {criticalPath.length > 0 ? (
              <div className="space-y-2">
                {criticalPath.slice(0, 5).map((taskId, index) => (
                  <div
                    key={taskId}
                    className="flex items-center space-x-3 rounded-md bg-red-50 p-2"
                  >
                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-medium text-red-600">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        Task {taskId}
                      </div>
                      <div className="text-xs text-gray-500">
                        Critical dependency
                      </div>
                    </div>
                  </div>
                ))}
                {criticalPath.length > 5 && (
                  <div className="text-center text-sm text-gray-500">
                    +{criticalPath.length - 5} more critical tasks
                  </div>
                )}
              </div>
            ) : (
              <div className="py-6 text-center text-gray-500">
                <div className="mb-2 text-2xl">✅</div>
                <p className="text-sm">No critical path issues detected</p>
              </div>
            )}
          </div>
        </div>

        {/* Milestone Tracker */}
        <div className="rounded-lg border bg-white shadow-sm">
          <div className="border-b p-4">
            <h3 className="text-lg font-medium text-gray-900">Milestones</h3>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {[
                {
                  name: "Project Kickoff",
                  date: project.plannedStartDate,
                  status: "completed",
                },
                {
                  name: "Design Phase Complete",
                  date: new Date(
                    project.plannedStartDate.getTime() +
                      30 * 24 * 60 * 60 * 1000
                  ),
                  status: "completed",
                },
                {
                  name: "Construction Start",
                  date: new Date(
                    project.plannedStartDate.getTime() +
                      60 * 24 * 60 * 60 * 1000
                  ),
                  status: "in_progress",
                },
                {
                  name: "Testing Phase",
                  date: new Date(
                    project.plannedEndDate.getTime() - 30 * 24 * 60 * 60 * 1000
                  ),
                  status: "pending",
                },
                {
                  name: "Project Completion",
                  date: project.plannedEndDate,
                  status: "pending",
                },
              ].map((milestone, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div
                    className={`h-3 w-3 flex-shrink-0 rounded-full ${
                      milestone.status === "completed"
                        ? "bg-green-500"
                        : milestone.status === "in_progress"
                          ? "bg-yellow-500"
                          : "bg-gray-300"
                    }`}
                  ></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {milestone.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {milestone.date.toLocaleDateString()}
                    </div>
                  </div>
                  <div
                    className={`rounded-full px-2 py-1 text-xs ${
                      milestone.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : milestone.status === "in_progress"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {milestone.status.replace("_", " ")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
