import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth, useRole } from "@hooks/useAuth";
import ProtectedRoute from "@features/auth/ProtectedRoute";

// Import refactored hooks and components
import {
  useProjectData,
  useProjectAnalytics,
  useProjectPerformance,
  useProjectActions,
} from "@features/projects/hooks";

import {
  ProjectHeader,
  AnalyticsBanner,
  ErrorBanner,
} from "@features/projects/components";

// Import utility functions
import {
  formatDate,
  calculateProgress,
  formatCurrency,
} from "@features/projects/utils/projectHelpers";

const ProjectDetail = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isAdmin, isManager } = useRole();

  // UI State
  const [showAdvancedActions, setShowAdvancedActions] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "schedule" | "specs" | "performance"
  >("overview");
  const [scheduleView, setScheduleView] = useState<
    "overview" | "gantt" | "tasks"
  >("overview");

  // Schedule timeline calculation
  const calculateScheduleData = () => {
    if (!project)
      return {
        timelineData: [],
        progressPercentage: 0,
        totalDays: 0,
        daysElapsed: 0,
      };

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
    const timelineData = phases.map((phase) => {
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

    return { timelineData, progressPercentage, totalDays, daysElapsed };
  };

  // Custom hooks for data management
  const {
    project,
    loading,
    error,
    warning,
    refreshing,
    fetchProject,
    setError,
    setWarning,
  } = useProjectData(projectId);

  const { analytics, fetchAnalytics } = useProjectAnalytics();

  const { performance, loadingPerformance, fetchPerformance } =
    useProjectPerformance();

  // Actions hook
  const {
    statusUpdating,
    handleStatusUpdate,
    handleDelete,
    handleCreateTemplate,
    handleAdvancedSearch,
  } = useProjectActions(
    project,
    projectId,
    user,
    () => fetchProject(true),
    () => fetchPerformance(projectId),
    setError,
    setWarning
  );

  // Effects
  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  useEffect(() => {
    if (project) {
      fetchPerformance(projectId);
    }
  }, [project, fetchPerformance, projectId]);

  // Loading state
  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 px-4 py-8">
          <div className="mx-auto max-w-7xl">
            {/* Header Skeleton */}
            <div className="mb-8 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-6 w-32 rounded bg-gray-300"></div>
                  <div className="h-6 w-px bg-gray-300"></div>
                  <div className="h-8 w-64 rounded bg-gray-300"></div>
                  <div className="h-6 w-20 rounded-full bg-gray-300"></div>
                </div>
                <div className="flex gap-3">
                  <div className="h-10 w-24 rounded bg-gray-300"></div>
                  <div className="h-10 w-28 rounded bg-gray-300"></div>
                </div>
              </div>
            </div>

            {/* Content Skeleton */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                {/* Analytics Banner Skeleton */}
                <div className="h-32 animate-pulse rounded-lg bg-gray-300"></div>

                {/* Cards Skeleton */}
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-64 animate-pulse rounded-lg bg-gray-300"
                  ></div>
                ))}
              </div>

              {/* Sidebar Skeleton */}
              <div className="space-y-6">
                <div className="h-96 animate-pulse rounded-lg bg-gray-300"></div>
              </div>
            </div>

            {/* Loading indicator */}
            <div className="fixed bottom-8 right-8 rounded-full bg-white p-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-blue-600"></div>
                <span className="text-sm font-medium text-gray-700">
                  Loading project details...
                </span>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // Error state
  if (!project) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 px-4 py-8">
          <div className="mx-auto max-w-7xl">
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              {/* Error Header */}
              <div className="border-b border-gray-200 bg-gradient-to-r from-red-50 to-orange-50 px-8 py-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                      <svg
                        className="h-6 w-6 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">
                        Project Not Found
                      </h1>
                      <p className="mt-1 text-gray-600">
                        Project ID: {projectId}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Error Content */}
              <div className="px-8 py-6">
                <div className="mx-auto max-w-2xl text-center">
                  <p className="mb-6 text-lg text-gray-600">
                    {error ||
                      "The requested project could not be found. It may have been deleted, moved, or you might not have permission to access it."}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <button
                      onClick={() => navigate("/dashboard")}
                      className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                      Back to Dashboard
                    </button>

                    <button
                      onClick={() => window.location.reload()}
                      className="flex items-center gap-2 rounded-lg bg-gray-100 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-200"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      Try Again
                    </button>
                  </div>

                  {/* Help Text */}
                  <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <h3 className="mb-2 font-medium text-gray-900">
                      Need Help?
                    </h3>
                    <p className="text-sm text-gray-600">
                      If you believe this is an error, please contact your
                      system administrator or try refreshing the page.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <ProjectHeader
            project={project}
            refreshing={refreshing}
            onRefresh={() => fetchProject(true)}
            onRefreshPerformance={() => fetchPerformance(projectId)}
            onStatusUpdate={handleStatusUpdate}
            onDelete={handleDelete}
            onCreateTemplate={handleCreateTemplate}
            onAdvancedSearch={handleAdvancedSearch}
            statusUpdating={statusUpdating}
            loadingPerformance={loadingPerformance}
            showAdvancedActions={showAdvancedActions}
            onToggleAdvancedActions={() =>
              setShowAdvancedActions(!showAdvancedActions)
            }
            isAdmin={isAdmin}
            isManager={isManager}
          />

          {/* Analytics Banner */}
          <div className="mb-8">
            <AnalyticsBanner analytics={analytics} project={project} />
          </div>

          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="px-6 py-4">
                <div className="flex gap-1">
                  {[
                    { id: "overview", label: "Overview", icon: "🏠" },
                    { id: "schedule", label: "Schedule & Tasks", icon: "📅" },
                    { id: "specs", label: "Specifications", icon: "⚙️" },
                    { id: "performance", label: "Performance", icon: "📊" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                        activeTab === tab.id
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
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="space-y-8 lg:col-span-2">
              {/* Error and Warning Banners */}
              <div className="space-y-4">
                {error && (
                  <div>
                    <ErrorBanner
                      error={error}
                      onDismiss={() => setError(null)}
                    />
                  </div>
                )}

                {warning && (
                  <div>
                    <ErrorBanner
                      error={warning}
                      onDismiss={() => setWarning(null)}
                    />
                  </div>
                )}
              </div>

              {/* Tab Content */}
              <div className="space-y-8">
                {/* Overview Tab */}
                {activeTab === "overview" && (
                  <div className="space-y-8">
                    {/* Project Overview */}
                    <div className="rounded-lg bg-white p-6 shadow-sm">
                      <h2 className="mb-4 text-xl font-semibold text-gray-900">
                        Project Overview
                      </h2>
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-sm font-medium text-gray-700">
                            Client
                          </label>
                          <p className="text-gray-900">
                            {project.clientInfo || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium text-gray-700">
                            Address
                          </label>
                          <p className="text-gray-900">
                            {project.address || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium text-gray-700">
                            Start Date
                          </label>
                          <p className="text-gray-900">
                            {formatDate(project.startDate)}
                          </p>
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium text-gray-700">
                            Estimated End Date
                          </label>
                          <p className="text-gray-900">
                            {formatDate(project.estimatedEndDate)}
                          </p>
                        </div>
                        {project.actualEndDate && (
                          <div className="md:col-span-2">
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                              Actual End Date
                            </label>
                            <p className="text-gray-900">
                              {formatDate(project.actualEndDate)}
                            </p>
                          </div>
                        )}
                        <div>
                          <label className="mb-1 block text-sm font-medium text-gray-700">
                            Status
                          </label>
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                              project.status === "Active"
                                ? "bg-green-100 text-green-800"
                                : project.status === "Completed"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {project.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Project Progress */}
                    <div className="rounded-lg bg-white p-6 shadow-sm">
                      <h2 className="mb-4 text-xl font-semibold text-gray-900">
                        Progress & Tasks
                      </h2>
                      <div className="space-y-4">
                        <div>
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">
                              Overall Progress
                            </span>
                            <span className="text-sm font-semibold text-gray-900">
                              {calculateProgress(
                                project.completedTaskCount,
                                project.taskCount
                              )}
                              %
                            </span>
                          </div>
                          <div className="h-3 w-full rounded-full bg-gray-200">
                            <div
                              className="h-3 rounded-full bg-blue-600 transition-all duration-300"
                              style={{
                                width: `${calculateProgress(
                                  project.completedTaskCount,
                                  project.taskCount
                                )}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="rounded-lg bg-blue-50 p-4 text-center">
                            <div className="text-2xl font-bold text-blue-600">
                              {project.completedTaskCount}
                            </div>
                            <div className="text-sm text-gray-600">
                              Completed Tasks
                            </div>
                          </div>
                          <div className="rounded-lg bg-gray-50 p-4 text-center">
                            <div className="text-2xl font-bold text-gray-600">
                              {project.taskCount}
                            </div>
                            <div className="text-sm text-gray-600">
                              Total Tasks
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Schedule Tab */}
                {activeTab === "schedule" && (
                  <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                    {/* Schedule Header */}
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

                      {/* Schedule View Tabs */}
                      <div className="mt-4 flex gap-1">
                        {[
                          { id: "overview", label: "Overview", icon: "📊" },
                          { id: "gantt", label: "Timeline", icon: "📈" },
                          { id: "tasks", label: "Tasks", icon: "✅" },
                        ].map((tab) => (
                          <button
                            key={tab.id}
                            onClick={() => setScheduleView(tab.id as any)}
                            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                              scheduleView === tab.id
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

                    {/* Schedule Content */}
                    <div className="p-6">
                      {(() => {
                        const {
                          timelineData,
                          progressPercentage,
                          totalDays,
                          daysElapsed,
                        } = calculateScheduleData();
                        const startDate = project
                          ? new Date(project.startDate)
                          : new Date();
                        const endDate = project?.estimatedEndDate
                          ? new Date(project.estimatedEndDate)
                          : new Date();

                        if (scheduleView === "overview") {
                          return (
                            <div className="space-y-6">
                              {/* Project Stats */}
                              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                                  <div className="text-sm font-medium text-blue-600">
                                    Progress
                                  </div>
                                  <div className="text-2xl font-bold text-blue-900">
                                    {progressPercentage}%
                                  </div>
                                  <div className="mt-1 text-xs text-blue-600">
                                    {project?.completedTaskCount || 0} of{" "}
                                    {project?.taskCount || 0} tasks
                                  </div>
                                </div>
                                <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                                  <div className="text-sm font-medium text-green-600">
                                    Start Date
                                  </div>
                                  <div className="text-lg font-bold text-green-900">
                                    {startDate.toLocaleDateString()}
                                  </div>
                                </div>
                                <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
                                  <div className="text-sm font-medium text-orange-600">
                                    Target End
                                  </div>
                                  <div className="text-lg font-bold text-orange-900">
                                    {endDate.toLocaleDateString()}
                                  </div>
                                </div>
                                <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
                                  <div className="text-sm font-medium text-purple-600">
                                    Duration
                                  </div>
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
                                        <span className="font-medium text-gray-900">
                                          {phase.name}
                                        </span>
                                        <span className="text-sm text-gray-600">
                                          {phase.startDate.toLocaleDateString()}{" "}
                                          - {phase.endDate.toLocaleDateString()}
                                        </span>
                                      </div>
                                      <div className="h-3 w-full rounded-full bg-gray-200">
                                        <div
                                          className={`h-3 rounded-full ${phase.color} transition-all duration-300`}
                                          style={{
                                            width: `${phase.progress}%`,
                                          }}
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
                        }

                        if (scheduleView === "gantt") {
                          return (
                            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                              <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
                                <h4 className="font-medium text-gray-900">
                                  Project Timeline
                                </h4>
                              </div>
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
                                    <div
                                      key={index}
                                      className="grid grid-cols-12 items-center gap-1"
                                    >
                                      <div className="col-span-3 truncate text-sm font-medium text-gray-900">
                                        {phase.name}
                                      </div>
                                      <div className="relative col-span-9">
                                        <div className="h-8 overflow-hidden rounded-lg bg-gray-100">
                                          <div
                                            className={`h-full ${phase.color} flex items-center rounded-lg px-2`}
                                            style={{
                                              width: `${
                                                (phase.duration / 75) * 100
                                              }%`,
                                            }}
                                          >
                                            <div
                                              className="h-full rounded bg-white bg-opacity-30"
                                              style={{
                                                width: `${phase.progress}%`,
                                              }}
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
                        }

                        if (scheduleView === "tasks") {
                          return (
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <h4 className="text-lg font-semibold text-gray-900">
                                  Task Management
                                </h4>
                                <button
                                  onClick={() => console.log("Create task")}
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
                                  {project &&
                                    Array.from(
                                      {
                                        length: Math.min(project.taskCount, 5),
                                      },
                                      (_, i) => (
                                        <div
                                          key={i}
                                          className="px-4 py-3 hover:bg-gray-50"
                                        >
                                          <div className="grid grid-cols-5 items-center gap-4 text-sm">
                                            <div className="font-medium text-gray-900">
                                              Task {i + 1} -{" "}
                                              {
                                                timelineData[
                                                  i % timelineData.length
                                                ]?.name
                                              }
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
                                              {project.projectManager
                                                ?.fullName || "Unassigned"}
                                            </div>
                                            <div className="text-gray-600">
                                              {new Date(
                                                Date.now() +
                                                  (i + 1) *
                                                    7 *
                                                    24 *
                                                    60 *
                                                    60 *
                                                    1000
                                              ).toLocaleDateString()}
                                            </div>
                                            <div className="flex gap-2">
                                              <button
                                                onClick={() =>
                                                  console.log(
                                                    "Edit task",
                                                    `task-${i}`
                                                  )
                                                }
                                                className="text-blue-600 hover:text-blue-800"
                                              >
                                                Edit
                                              </button>
                                              <button
                                                onClick={() =>
                                                  console.log(
                                                    "Delete task",
                                                    `task-${i}`
                                                  )
                                                }
                                                className="text-red-600 hover:text-red-800"
                                              >
                                                Delete
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      )
                                    )}

                                  {project && project.taskCount === 0 && (
                                    <div className="px-4 py-8 text-center text-gray-500">
                                      No tasks available. Click "Add Task" to
                                      create the first task.
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        }

                        return null;
                      })()}
                    </div>
                  </div>
                )}

                {/* Specifications Tab */}
                {activeTab === "specs" && (
                  <div className="space-y-8">
                    {/* Technical Specifications */}
                    <div className="rounded-lg bg-white p-6 shadow-sm">
                      <h2 className="mb-4 text-xl font-semibold text-gray-900">
                        Technical Specifications
                      </h2>
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-sm font-medium text-gray-700">
                            Total Capacity
                          </label>
                          <p className="text-gray-900">
                            {project.totalCapacityKw
                              ? `${project.totalCapacityKw} kW`
                              : "Not specified"}
                          </p>
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium text-gray-700">
                            PV Module Count
                          </label>
                          <p className="text-gray-900">
                            {project.pvModuleCount || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium text-gray-700">
                            Connection Type
                          </label>
                          <p className="text-gray-900">
                            {project.connectionType || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium text-gray-700">
                            Team
                          </label>
                          <p className="text-gray-900">
                            {project.team || "Not assigned"}
                          </p>
                        </div>
                        {project.connectionNotes && (
                          <div className="md:col-span-2">
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                              Connection Notes
                            </label>
                            <p className="text-gray-900">
                              {project.connectionNotes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Equipment Details */}
                    {project.equipmentDetails && (
                      <div className="rounded-lg bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-xl font-semibold text-gray-900">
                          Equipment Details
                        </h2>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                          <div className="rounded-lg bg-gray-50 p-4 text-center">
                            <div className="text-xl font-bold text-gray-900">
                              {project.equipmentDetails.inverter125kw || 0}
                            </div>
                            <div className="text-sm text-gray-600">
                              125kW Inverters
                            </div>
                          </div>
                          <div className="rounded-lg bg-gray-50 p-4 text-center">
                            <div className="text-xl font-bold text-gray-900">
                              {project.equipmentDetails.inverter80kw || 0}
                            </div>
                            <div className="text-sm text-gray-600">
                              80kW Inverters
                            </div>
                          </div>
                          <div className="rounded-lg bg-gray-50 p-4 text-center">
                            <div className="text-xl font-bold text-gray-900">
                              {project.equipmentDetails.inverter60kw || 0}
                            </div>
                            <div className="text-sm text-gray-600">
                              60kW Inverters
                            </div>
                          </div>
                          <div className="rounded-lg bg-gray-50 p-4 text-center">
                            <div className="text-xl font-bold text-gray-900">
                              {project.equipmentDetails.inverter40kw || 0}
                            </div>
                            <div className="text-sm text-gray-600">
                              40kW Inverters
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Performance Tab */}
                {activeTab === "performance" && (
                  <div>
                    {performance ? (
                      <div className="rounded-lg bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                          <h2 className="text-xl font-semibold text-gray-900">
                            Performance Analytics
                          </h2>
                          <div className="flex items-center gap-2">
                            <div
                              className={`rounded-full px-3 py-1 text-sm font-medium ${
                                performance.riskAssessment.riskLevel === "Low"
                                  ? "bg-green-100 text-green-800"
                                  : performance.riskAssessment.riskLevel ===
                                      "Medium"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }`}
                            >
                              Risk: {performance.riskAssessment.riskLevel}
                            </div>
                            <div className="text-2xl font-bold text-blue-600">
                              {performance.overallScore}%
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                          <div className="rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 p-4">
                            <div className="mb-2 flex items-center justify-between">
                              <span className="text-sm font-medium text-blue-700">
                                Timeline
                              </span>
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
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            </div>
                            <div className="text-2xl font-bold text-blue-900">
                              {performance.kpis.timelineAdherence}%
                            </div>
                            <div className="text-xs text-blue-600">
                              Adherence
                            </div>
                          </div>

                          <div className="rounded-lg bg-gradient-to-r from-green-50 to-green-100 p-4">
                            <div className="mb-2 flex items-center justify-between">
                              <span className="text-sm font-medium text-green-700">
                                Budget
                              </span>
                              <svg
                                className="h-5 w-5 text-green-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                                />
                              </svg>
                            </div>
                            <div className="text-2xl font-bold text-green-900">
                              {performance.kpis.budgetEfficiency}%
                            </div>
                            <div className="text-xs text-green-600">
                              Efficiency
                            </div>
                          </div>

                          <div className="rounded-lg bg-gradient-to-r from-purple-50 to-purple-100 p-4">
                            <div className="mb-2 flex items-center justify-between">
                              <span className="text-sm font-medium text-purple-700">
                                Quality
                              </span>
                            </div>
                            <div className="text-2xl font-bold text-purple-900">
                              {performance.kpis.qualityScore}%
                            </div>
                            <div className="text-xs text-purple-600">Score</div>
                          </div>

                          <div className="rounded-lg bg-gradient-to-r from-orange-50 to-orange-100 p-4">
                            <div className="mb-2 flex items-center justify-between">
                              <span className="text-sm font-medium text-orange-700">
                                Safety
                              </span>
                            </div>
                            <div className="text-2xl font-bold text-orange-900">
                              {performance.kpis.safetyRecord}%
                            </div>
                            <div className="text-xs text-orange-600">
                              Record
                            </div>
                          </div>

                          <div className="rounded-lg bg-gradient-to-r from-pink-50 to-pink-100 p-4">
                            <div className="mb-2 flex items-center justify-between">
                              <span className="text-sm font-medium text-pink-700">
                                Stakeholder
                              </span>
                            </div>
                            <div className="text-2xl font-bold text-pink-900">
                              {performance.kpis.stakeholderSatisfaction}%
                            </div>
                            <div className="text-xs text-pink-600">
                              Satisfaction
                            </div>
                          </div>

                          <div className="rounded-lg bg-gradient-to-r from-red-50 to-red-100 p-4">
                            <div className="mb-2 flex items-center justify-between">
                              <span className="text-sm font-medium text-red-700">
                                Risks
                              </span>
                            </div>
                            <div className="text-2xl font-bold text-red-900">
                              {performance.riskAssessment.activeRisks}
                            </div>
                            <div className="text-xs text-red-600">Active</div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-lg bg-white p-6 shadow-sm">
                        <div className="text-center text-gray-500">
                          <svg
                            className="mx-auto mb-4 h-12 w-12 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H9a2 2 0 01-2-2z"
                            />
                          </svg>
                          <p>No performance data available</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar with sticky positioning */}
            <div className="lg:sticky lg:top-8 lg:self-start">
              <div className="space-y-6">
                {/* Project Manager */}
                <div className="rounded-lg bg-white p-6 shadow-sm">
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">
                    Project Manager
                  </h3>
                  {project.projectManager ? (
                    <div className="flex items-center space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                        <span className="font-medium text-blue-600">
                          {project.projectManager.fullName?.charAt(0) || "?"}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {project.projectManager.fullName || "Unknown"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {project.projectManager.email || "No email"}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-4 text-center text-gray-500">
                      <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                        <span className="text-gray-400">?</span>
                      </div>
                      <div className="text-sm">No manager assigned</div>
                    </div>
                  )}
                </div>

                {/* Financial Information */}
                <div className="rounded-lg bg-white p-6 shadow-sm">
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">
                    Financial Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Revenue Value
                      </label>
                      <p className="text-gray-900">
                        {project.revenueValue !== null &&
                        project.revenueValue !== 0
                          ? formatCurrency(project.revenueValue)
                          : project.totalCapacityKw
                            ? formatCurrency(project.totalCapacityKw * 5000) +
                              " (estimated)"
                            : "Not specified"}
                      </p>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        FTS Value
                      </label>
                      <p className="text-gray-900">
                        {project.ftsValue !== null && project.ftsValue !== 0
                          ? formatCurrency(project.ftsValue)
                          : "Not specified"}
                      </p>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        PQM Value
                      </label>
                      <p className="text-gray-900">
                        {project.pqmValue !== null && project.pqmValue !== 0
                          ? formatCurrency(project.pqmValue)
                          : "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Technical Details */}
                <div className="rounded-lg bg-white p-6 shadow-sm">
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">
                    Technical Details
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Connection Type
                      </label>
                      <p className="text-gray-900">
                        {project.connectionType || "Not specified"}
                        {project.connectionType === "MV" && (
                          <span className="ml-2 text-sm text-blue-600">
                            (Medium Voltage)
                          </span>
                        )}
                      </p>
                    </div>
                    {project.connectionNotes && (
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Connection Notes
                        </label>
                        <p className="text-sm text-gray-900">
                          {project.connectionNotes}
                        </p>
                      </div>
                    )}
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Total Capacity
                      </label>
                      <p className="text-gray-900">
                        {project.totalCapacityKw
                          ? `${project.totalCapacityKw} kW`
                          : "Not specified"}
                      </p>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        PV Modules
                      </label>
                      <p className="text-gray-900">
                        {project.pvModuleCount || "Not specified"}
                        {project.pvModuleCount && project.totalCapacityKw && (
                          <span className="ml-2 text-sm text-gray-500">
                            (~
                            {(
                              (project.totalCapacityKw /
                                project.pvModuleCount) *
                              1000
                            ).toFixed(0)}
                            W each)
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Project Info */}
                <div className="rounded-lg bg-white p-6 shadow-sm">
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">
                    Project Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Team Assignment
                      </label>
                      <p className="text-gray-900">
                        {project.team || "Not assigned"}
                      </p>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Current Status
                      </label>
                      <p className="text-gray-900">
                        {project.status || "Unknown"}
                      </p>
                    </div>
                    {project.estimatedEndDate && (
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Estimated End Date
                        </label>
                        <p className="text-gray-900">
                          {new Date(
                            project.estimatedEndDate
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Location Information */}
                {project.locationCoordinates && (
                  <div className="rounded-lg bg-white p-6 shadow-sm">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900">
                      Location
                    </h3>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">
                          Coordinates:
                        </span>
                        <br />
                        <span className="font-mono text-xs text-gray-900">
                          {project.locationCoordinates.latitude.toFixed(6)},{" "}
                          {project.locationCoordinates.longitude.toFixed(6)}
                        </span>
                      </div>
                      {project.address && (
                        <div className="text-sm">
                          <span className="font-medium text-gray-700">
                            Address:
                          </span>
                          <br />
                          <span className="text-gray-900">
                            {project.address}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Loading Indicator for Performance Data */}
          {loadingPerformance && (
            <div className="fixed bottom-8 right-8 z-50 rounded-full border border-gray-200 bg-white p-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-indigo-600"></div>
                <span className="text-sm font-medium text-gray-700">
                  Updating performance data...
                </span>
              </div>
            </div>
          )}

          {/* Refresh Indicator */}
          {refreshing && (
            <div className="fixed right-8 top-8 z-50 rounded-full border border-gray-200 bg-white p-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-gray-600"></div>
                <span className="text-sm font-medium text-gray-700">
                  Refreshing project data...
                </span>
              </div>
            </div>
          )}

          {/* Floating Quick Actions Button */}
          <div className="fixed bottom-8 left-8 z-50">
            <div className="relative">
              {/* Quick Actions Menu */}
              {showQuickActions && (
                <div className="absolute bottom-16 left-0 min-w-[200px] rounded-lg border border-gray-200 bg-white p-2 shadow-lg">
                  <div className="space-y-1">
                    <button
                      onClick={() => fetchProject(true)}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-gray-100"
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
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      Refresh Data
                    </button>

                    <button
                      onClick={() =>
                        navigate(`/projects/${projectId}/schedule`)
                      }
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-gray-100"
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
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      View Schedule
                    </button>

                    {(isAdmin || isManager) && (
                      <button
                        onClick={() =>
                          setShowAdvancedActions(!showAdvancedActions)
                        }
                        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-gray-100"
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
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        Advanced Actions
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* FAB Button */}
              <button
                onClick={() => setShowQuickActions(!showQuickActions)}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-colors duration-200 hover:bg-blue-700"
              >
                <svg
                  className={`h-6 w-6 transition-transform duration-200 ${
                    showQuickActions ? "rotate-45" : ""
                  }`}
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
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ProjectDetail;
