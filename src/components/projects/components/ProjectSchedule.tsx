import React, { useState } from "react";
import { ProjectDto } from "../../../shared/types/project";

interface ProjectScheduleProps {
  project: ProjectDto;
  onTaskUpdate?: (taskId: string, updates: any) => void;
  onTaskCreate?: (taskData: any) => void;
  onTaskDelete?: (taskId: string) => void;
}

const ProjectSchedule = ({
  project,
  onTaskUpdate,
  onTaskCreate,
  onTaskDelete,
}: ProjectScheduleProps) => {
  const [activeView, setActiveView] = useState<"overview" | "gantt" | "tasks">(
    "overview"
  );

  // Calculate project timeline
  const startDate = new Date(project.startDate);
  const endDate = project.estimatedEndDate
    ? new Date(project.estimatedEndDate)
    : new Date();
  const totalDays = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const daysElapsed = Math.ceil(
    (new Date().getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const progressPercentage =
    project.taskCount > 0
      ? Math.round((project.completedTaskCount / project.taskCount) * 100)
      : 0;

  const viewTabs = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "gantt", label: "Timeline", icon: "📈" },
    { id: "tasks", label: "Tasks", icon: "✅" },
  ];

  // Generate mock timeline data for display
  const generateTimelineData = () => {
    const phases = [
      {
        name: "Planning & Design",
        duration: 15,
        status: "completed",
        color: "bg-green-500",
      },
      {
        name: "Procurement",
        duration: 20,
        status: "in-progress",
        color: "bg-blue-500",
      },
      {
        name: "Installation",
        duration: 30,
        status: "pending",
        color: "bg-gray-400",
      },
      {
        name: "Testing & Commissioning",
        duration: 10,
        status: "pending",
        color: "bg-gray-400",
      },
    ];

    let currentDate = new Date(startDate);
    return phases.map((phase) => {
      const phaseStart = new Date(currentDate);
      currentDate.setDate(currentDate.getDate() + phase.duration);
      const phaseEnd = new Date(currentDate);

      return {
        ...phase,
        startDate: phaseStart,
        endDate: phaseEnd,
        progress:
          phase.status === "completed"
            ? 100
            : phase.status === "in-progress"
              ? 60
              : 0,
      };
    });
  };

  const timelineData = generateTimelineData();

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Project Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="text-sm font-medium text-blue-600">Progress</div>
          <div className="text-2xl font-bold text-blue-900">
            {progressPercentage}%
          </div>
          <div className="mt-1 text-xs text-blue-600">
            {project.completedTaskCount} of {project.taskCount} tasks
          </div>
        </div>

        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <div className="text-sm font-medium text-green-600">Start Date</div>
          <div className="text-lg font-bold text-green-900">
            {startDate.toLocaleDateString()}
          </div>
        </div>

        <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
          <div className="text-sm font-medium text-orange-600">Target End</div>
          <div className="text-lg font-bold text-orange-900">
            {endDate.toLocaleDateString()}
          </div>
        </div>

        <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
          <div className="text-sm font-medium text-purple-600">Duration</div>
          <div className="text-lg font-bold text-purple-900">
            {totalDays} days
          </div>
          <div className="mt-1 text-xs text-purple-600">
            {daysElapsed} elapsed
          </div>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h4 className="mb-4 text-lg font-semibold text-gray-900">
          Project Phases
        </h4>
        <div className="space-y-4">
          {timelineData.map((phase, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">{phase.name}</span>
                <span className="text-sm text-gray-600">
                  {phase.startDate.toLocaleDateString()} -{" "}
                  {phase.endDate.toLocaleDateString()}
                </span>
              </div>
              <div className="h-3 w-full rounded-full bg-gray-200">
                <div
                  className={`h-3 rounded-full ${phase.color} transition-all duration-300`}
                  style={{ width: `${phase.progress}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span
                  className={`rounded px-2 py-1 text-xs font-medium capitalize ${
                    phase.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : phase.status === "in-progress"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {phase.status.replace("-", " ")}
                </span>
                <span className="text-gray-600">
                  {phase.progress}% complete
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderGanttChart = () => (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
        <h4 className="font-medium text-gray-900">Project Timeline</h4>
      </div>

      {/* Simplified Gantt Chart */}
      <div className="p-4">
        <div className="mb-4 grid grid-cols-12 gap-1 text-xs text-gray-600">
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} className="text-center">
              Week {i + 1}
            </div>
          ))}
        </div>

        <div className="space-y-3">
          {timelineData.map((phase, index) => (
            <div key={index} className="grid grid-cols-12 items-center gap-1">
              <div className="col-span-3 truncate text-sm font-medium text-gray-900">
                {phase.name}
              </div>
              <div className="relative col-span-9">
                <div className="h-8 overflow-hidden rounded-lg bg-gray-100">
                  <div
                    className={`h-full ${phase.color} flex items-center rounded-lg px-2`}
                    style={{ width: `${(phase.duration / 75) * 100}%` }}
                  >
                    <div
                      className="h-full rounded bg-white bg-opacity-30"
                      style={{ width: `${phase.progress}%` }}
                    />
                  </div>
                </div>
                <div className="absolute inset-y-0 left-2 flex items-center">
                  <span className="text-xs font-medium text-white">
                    {phase.duration}d
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTasks = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-gray-900">Task Management</h4>
        <button
          onClick={() => onTaskCreate && onTaskCreate({})}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Add Task
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
          <div className="grid grid-cols-5 gap-4 text-sm font-medium text-gray-700">
            <div>Task Name</div>
            <div>Status</div>
            <div>Assigned To</div>
            <div>Due Date</div>
            <div>Actions</div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {/* Mock task data based on project info */}
          {Array.from({ length: Math.min(project.taskCount, 5) }, (_, i) => (
            <div key={i} className="px-4 py-3 hover:bg-gray-50">
              <div className="grid grid-cols-5 items-center gap-4 text-sm">
                <div className="font-medium text-gray-900">
                  Task {i + 1} - {timelineData[i % timelineData.length]?.name}
                </div>
                <div>
                  <span
                    className={`rounded px-2 py-1 text-xs font-medium ${
                      i < project.completedTaskCount
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {i < project.completedTaskCount
                      ? "Completed"
                      : "In Progress"}
                  </span>
                </div>
                <div className="text-gray-600">
                  {project.projectManager?.fullName || "Unassigned"}
                </div>
                <div className="text-gray-600">
                  {new Date(
                    Date.now() + (i + 1) * 7 * 24 * 60 * 60 * 1000
                  ).toLocaleDateString()}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      onTaskUpdate && onTaskUpdate(`task-${i}`, {})
                    }
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onTaskDelete && onTaskDelete(`task-${i}`)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}

          {project.taskCount === 0 && (
            <div className="px-4 py-8 text-center text-gray-500">
              No tasks available. Click "Add Task" to create the first task.
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <svg
                className="h-5 w-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Project Schedule
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Manage project timeline, tasks, and milestones
            </p>
          </div>
        </div>

        {/* View Tabs */}
        <div className="mt-4 flex gap-1">
          {viewTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as any)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeView === tab.id
                  ? "border border-blue-200 bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeView === "overview" && renderOverview()}
        {activeView === "gantt" && renderGanttChart()}
        {activeView === "tasks" && renderTasks()}
      </div>
    </div>
  );
};

export default ProjectSchedule;
