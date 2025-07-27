import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth, useRole } from "../shared/hooks/useAuth";
import ProtectedRoute from "../features/auth/ProtectedRoute";

// Import refactored hooks and components
import {
  useProjectData,
  useProjectAnalytics,
  useProjectPerformance,
  useProjectActions,
} from "../features/projects/hooks";

import {
  ProjectHeader,
  AnalyticsBanner,
  ErrorBanner,
  ProjectOverview,
  ProjectProgress,
  TechnicalSpecs,
  PerformanceMetrics,
  ProjectSidebar,
  EquipmentDetails,
  ProjectSchedule,
} from "../features/projects/components";

const ProjectDetail = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isAdmin, isManager } = useRole();

  // UI State
  const [showAdvancedActions, setShowAdvancedActions] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "schedule" | "specs" | "performance">("overview");
  const [scheduleView, setScheduleView] = useState<"overview" | "gantt" | "tasks">("overview");

  // Schedule timeline calculation
  const calculateScheduleData = () => {
    if (!project) return { timelineData: [], progressPercentage: 0, totalDays: 0, daysElapsed: 0 };
    
    const startDate = new Date(project.startDate);
    const endDate = project.estimatedEndDate ? new Date(project.estimatedEndDate) : new Date();
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const daysElapsed = Math.ceil((new Date().getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const progressPercentage = project.taskCount > 0 ? Math.round((project.completedTaskCount / project.taskCount) * 100) : 0;

    const phases = [
      { name: "Planning & Design", duration: 15, status: "completed", color: "bg-green-500" },
      { name: "Procurement", duration: 20, status: "in-progress", color: "bg-blue-500" },
      { name: "Installation", duration: 30, status: "pending", color: "bg-gray-400" },
      { name: "Testing & Commissioning", duration: 10, status: "pending", color: "bg-gray-400" },
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
        progress: phase.status === "completed" ? 100 : phase.status === "in-progress" ? 60 : 0,
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
          <div className="max-w-7xl mx-auto">
            {/* Header Skeleton */}
            <div className="mb-8 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-6 w-32 bg-gray-300 rounded"></div>
                  <div className="h-6 w-px bg-gray-300"></div>
                  <div className="h-8 w-64 bg-gray-300 rounded"></div>
                  <div className="h-6 w-20 bg-gray-300 rounded-full"></div>
                </div>
                <div className="flex gap-3">
                  <div className="h-10 w-24 bg-gray-300 rounded"></div>
                  <div className="h-10 w-28 bg-gray-300 rounded"></div>
                </div>
              </div>
            </div>

            {/* Content Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {/* Analytics Banner Skeleton */}
                <div className="h-32 bg-gray-300 rounded-lg animate-pulse"></div>

                {/* Cards Skeleton */}
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-64 bg-gray-300 rounded-lg animate-pulse"
                  ></div>
                ))}
              </div>

              {/* Sidebar Skeleton */}
              <div className="space-y-6">
                <div className="h-96 bg-gray-300 rounded-lg animate-pulse"></div>
              </div>
            </div>

            {/* Loading indicator */}
            <div className="fixed bottom-8 right-8 bg-white rounded-full shadow-lg p-4">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
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
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Error Header */}
              <div className="bg-gradient-to-r from-red-50 to-orange-50 px-8 py-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-red-600"
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
                      <p className="text-gray-600 mt-1">
                        Project ID: {projectId}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Error Content */}
              <div className="px-8 py-6">
                <div className="text-center max-w-2xl mx-auto">
                  <p className="text-gray-600 text-lg mb-6">
                    {error ||
                      "The requested project could not be found. It may have been deleted, moved, or you might not have permission to access it."}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button
                      onClick={() => navigate("/dashboard")}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
                    >
                      <svg
                        className="w-5 h-5"
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
                      className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 font-medium"
                    >
                      <svg
                        className="w-5 h-5"
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
                  <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="font-medium text-gray-900 mb-2">
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
        <div className="max-w-7xl mx-auto">
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
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
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
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                        activeTab === tab.id
                          ? "bg-blue-100 text-blue-700 border border-blue-200"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Error and Warning Banners */}
              <div className="space-y-4">
                {error && (
                  <div className="transform transition-all duration-300 ease-in-out">
                    <ErrorBanner
                      error={error}
                      onDismiss={() => setError(null)}
                    />
                  </div>
                )}

                {warning && (
                  <div className="transform transition-all duration-300 ease-in-out">
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
                    <div className="transform transition-all duration-300 ease-in-out hover:scale-[1.01]">
                      <ProjectOverview project={project} />
                    </div>
                    <div className="transform transition-all duration-300 ease-in-out hover:scale-[1.01]">
                      <ProjectProgress project={project} />
                    </div>
                  </div>
                )}

                {/* Schedule Tab */}
                {activeTab === "schedule" && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    {/* Schedule Header */}
                    <div className="px-6 py-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Project Schedule
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Manage project timeline, tasks, and milestones
                          </p>
                        </div>
                      </div>

                      {/* Schedule View Tabs */}
                      <div className="flex gap-1 mt-4">
                        {[
                          { id: "overview", label: "Overview", icon: "📊" },
                          { id: "gantt", label: "Timeline", icon: "📈" },
                          { id: "tasks", label: "Tasks", icon: "✅" },
                        ].map((tab) => (
                          <button
                            key={tab.id}
                            onClick={() => setScheduleView(tab.id as any)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                              scheduleView === tab.id
                                ? "bg-blue-100 text-blue-700 border border-blue-200"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
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
                        const { timelineData, progressPercentage, totalDays, daysElapsed } = calculateScheduleData();
                        const startDate = project ? new Date(project.startDate) : new Date();
                        const endDate = project?.estimatedEndDate ? new Date(project.estimatedEndDate) : new Date();

                        if (scheduleView === "overview") {
                          return (
                            <div className="space-y-6">
                              {/* Project Stats */}
                              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                  <div className="text-blue-600 text-sm font-medium">Progress</div>
                                  <div className="text-2xl font-bold text-blue-900">{progressPercentage}%</div>
                                  <div className="text-blue-600 text-xs mt-1">
                                    {project?.completedTaskCount || 0} of {project?.taskCount || 0} tasks
                                  </div>
                                </div>
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                  <div className="text-green-600 text-sm font-medium">Start Date</div>
                                  <div className="text-lg font-bold text-green-900">{startDate.toLocaleDateString()}</div>
                                </div>
                                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                  <div className="text-orange-600 text-sm font-medium">Target End</div>
                                  <div className="text-lg font-bold text-orange-900">{endDate.toLocaleDateString()}</div>
                                </div>
                                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                  <div className="text-purple-600 text-sm font-medium">Duration</div>
                                  <div className="text-lg font-bold text-purple-900">{totalDays} days</div>
                                  <div className="text-purple-600 text-xs mt-1">{daysElapsed} elapsed</div>
                                </div>
                              </div>

                              {/* Progress Timeline */}
                              <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <h4 className="text-lg font-semibold text-gray-900 mb-4">Project Phases</h4>
                                <div className="space-y-4">
                                  {timelineData.map((phase, index) => (
                                    <div key={index} className="space-y-2">
                                      <div className="flex justify-between items-center">
                                        <span className="font-medium text-gray-900">{phase.name}</span>
                                        <span className="text-sm text-gray-600">
                                          {phase.startDate.toLocaleDateString()} - {phase.endDate.toLocaleDateString()}
                                        </span>
                                      </div>
                                      <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div
                                          className={`h-3 rounded-full ${phase.color} transition-all duration-300`}
                                          style={{ width: `${phase.progress}%` }}
                                        />
                                      </div>
                                      <div className="flex justify-between items-center text-sm">
                                        <span className={`capitalize px-2 py-1 rounded text-xs font-medium ${
                                          phase.status === "completed" 
                                            ? "bg-green-100 text-green-800"
                                            : phase.status === "in-progress"
                                            ? "bg-blue-100 text-blue-800"
                                            : "bg-gray-100 text-gray-800"
                                        }`}>
                                          {phase.status.replace("-", " ")}
                                        </span>
                                        <span className="text-gray-600">{phase.progress}% complete</span>
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
                            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                                <h4 className="font-medium text-gray-900">Project Timeline</h4>
                              </div>
                              <div className="p-4">
                                <div className="grid grid-cols-12 gap-1 mb-4 text-xs text-gray-600">
                                  {Array.from({ length: 12 }, (_, i) => (
                                    <div key={i} className="text-center">Week {i + 1}</div>
                                  ))}
                                </div>
                                <div className="space-y-3">
                                  {timelineData.map((phase, index) => (
                                    <div key={index} className="grid grid-cols-12 gap-1 items-center">
                                      <div className="col-span-3 text-sm font-medium text-gray-900 truncate">
                                        {phase.name}
                                      </div>
                                      <div className="col-span-9 relative">
                                        <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
                                          <div
                                            className={`h-full ${phase.color} rounded-lg flex items-center px-2`}
                                            style={{ width: `${(phase.duration / 75) * 100}%` }}
                                          >
                                            <div
                                              className="h-full bg-white bg-opacity-30 rounded"
                                              style={{ width: `${phase.progress}%` }}
                                            />
                                          </div>
                                        </div>
                                        <div className="absolute inset-y-0 left-2 flex items-center">
                                          <span className="text-white text-xs font-medium">{phase.duration}d</span>
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
                              <div className="flex justify-between items-center">
                                <h4 className="text-lg font-semibold text-gray-900">Task Management</h4>
                                <button
                                  onClick={() => console.log("Create task")}
                                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                  </svg>
                                  Add Task
                                </button>
                              </div>

                              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                                  <div className="grid grid-cols-5 gap-4 text-sm font-medium text-gray-700">
                                    <div>Task Name</div>
                                    <div>Status</div>
                                    <div>Assigned To</div>
                                    <div>Due Date</div>
                                    <div>Actions</div>
                                  </div>
                                </div>

                                <div className="divide-y divide-gray-200">
                                  {project && Array.from({ length: Math.min(project.taskCount, 5) }, (_, i) => (
                                    <div key={i} className="px-4 py-3 hover:bg-gray-50">
                                      <div className="grid grid-cols-5 gap-4 text-sm items-center">
                                        <div className="font-medium text-gray-900">
                                          Task {i + 1} - {timelineData[i % timelineData.length]?.name}
                                        </div>
                                        <div>
                                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                                            i < project.completedTaskCount
                                              ? "bg-green-100 text-green-800"
                                              : "bg-yellow-100 text-yellow-800"
                                          }`}>
                                            {i < project.completedTaskCount ? "Completed" : "In Progress"}
                                          </span>
                                        </div>
                                        <div className="text-gray-600">
                                          {project.projectManager?.fullName || "Unassigned"}
                                        </div>
                                        <div className="text-gray-600">
                                          {new Date(Date.now() + (i + 1) * 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                                        </div>
                                        <div className="flex gap-2">
                                          <button
                                            onClick={() => console.log("Edit task", `task-${i}`)}
                                            className="text-blue-600 hover:text-blue-800"
                                          >
                                            Edit
                                          </button>
                                          <button
                                            onClick={() => console.log("Delete task", `task-${i}`)}
                                            className="text-red-600 hover:text-red-800"
                                          >
                                            Delete
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                  
                                  {project && project.taskCount === 0 && (
                                    <div className="px-4 py-8 text-center text-gray-500">
                                      No tasks available. Click "Add Task" to create the first task.
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
                    <div className="transform transition-all duration-300 ease-in-out hover:scale-[1.01]">
                      <TechnicalSpecs project={project} />
                    </div>
                    <div className="transform transition-all duration-300 ease-in-out hover:scale-[1.01]">
                      <EquipmentDetails project={project} />
                    </div>
                  </div>
                )}

                {/* Performance Tab */}
                {activeTab === "performance" && (
                  <div className="transform transition-all duration-300 ease-in-out hover:scale-[1.01]">
                    <PerformanceMetrics performance={performance} />
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar with sticky positioning */}
            <div className="lg:sticky lg:top-8 lg:self-start">
              <div className="transform transition-all duration-300 ease-in-out hover:scale-[1.01]">
                <ProjectSidebar project={project} />
              </div>
            </div>
          </div>

          {/* Loading Indicator for Performance Data */}
          {loadingPerformance && (
            <div className="fixed bottom-8 right-8 bg-white rounded-full shadow-lg p-4 border border-gray-200 z-50">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
                <span className="text-sm font-medium text-gray-700">
                  Updating performance data...
                </span>
              </div>
            </div>
          )}

          {/* Refresh Indicator */}
          {refreshing && (
            <div className="fixed top-8 right-8 bg-white rounded-full shadow-lg p-4 border border-gray-200 z-50">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
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
                <div className="absolute bottom-16 left-0 bg-white rounded-lg shadow-lg border border-gray-200 p-2 min-w-[200px]">
                  <div className="space-y-1">
                    <button
                      onClick={() => fetchProject(true)}
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 transition-colors flex items-center gap-2 text-sm"
                    >
                      <svg
                        className="w-4 h-4"
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
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 transition-colors flex items-center gap-2 text-sm"
                    >
                      <svg
                        className="w-4 h-4"
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
                        className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 transition-colors flex items-center gap-2 text-sm"
                      >
                        <svg
                          className="w-4 h-4"
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
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
              >
                <svg
                  className={`w-6 h-6 transition-transform duration-200 ${
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
