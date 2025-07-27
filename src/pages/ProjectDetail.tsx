import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { projectsApi } from "../shared/utils/projectsApi";
import { ProjectDto } from "../shared/types/project";
import { useAuth, useRole } from "../shared/hooks/useAuth";
import ProtectedRoute from "../features/auth/ProtectedRoute";

const ProjectDetail: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isAdmin, isManager } = useRole();

  const [project, setProject] = useState<ProjectDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

  // Fetch project data
  const fetchProject = async (showRefreshing = false) => {
    if (!projectId) {
      setError("Project ID is required");
      setLoading(false);
      return;
    }

    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      console.log(`🔍 [ProjectDetail] Fetching project: ${projectId}`);

      const projectData = await projectsApi.getProjectById(projectId);
      setProject(projectData);

      console.log(`✅ [ProjectDetail] Project loaded:`, projectData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load project";
      console.error(`❌ [ProjectDetail] Error fetching project:`, err);
      setError(errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  // Handle project status update
  const handleStatusUpdate = async (newStatus: string) => {
    if (!project || !projectId) return;

    try {
      setStatusUpdating(true);

      // Use the PATCH endpoint for status updates
      await projectsApi.patchProject(projectId, { status: newStatus as any });

      // Refresh project data
      await fetchProject(true);

      console.log(`✅ [ProjectDetail] Status updated to: ${newStatus}`);
    } catch (err) {
      console.error(`❌ [ProjectDetail] Failed to update status:`, err);
      setError(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setStatusUpdating(false);
    }
  };

  // Handle project deletion
  const handleDelete = async () => {
    if (!project || !projectId) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${project.projectName}"? This action cannot be undone.`
    );

    if (!confirmDelete) return;

    try {
      await projectsApi.deleteProject(projectId);
      console.log(`✅ [ProjectDetail] Project deleted: ${projectId}`);
      navigate("/dashboard");
    } catch (err) {
      console.error(`❌ [ProjectDetail] Failed to delete project:`, err);
      setError(err instanceof Error ? err.message : "Failed to delete project");
    }
  };

  // Loading state
  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading project details...</p>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // Error state
  if (error || !project) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="text-red-500 text-5xl mb-4">⚠️</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Project Not Found
              </h1>
              <p className="text-gray-600 mb-6">
                {error || "The requested project could not be found."}
              </p>
              <button
                onClick={() => navigate("/dashboard")}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // Helper functions
  const getStatusBadgeColor = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "inprogress":
        return "bg-blue-100 text-blue-800";
      case "planning":
        return "bg-yellow-100 text-yellow-800";
      case "onhold":
        return "bg-orange-100 text-orange-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (value: number | null) => {
    if (value === null || value === undefined) return "Not specified";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  const calculateProgress = () => {
    if (!project.taskCount || project.taskCount === 0) return 0;
    return Math.round((project.completedTaskCount / project.taskCount) * 100);
  };

  const progress = calculateProgress();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <svg
                    className="w-5 h-5 mr-2"
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
                <div className="h-6 w-px bg-gray-300"></div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {project.projectName || "Unnamed Project"}
                </h1>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(
                    project.status
                  )}`}
                >
                  {project.status || "Unknown"}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {/* Refresh Button */}
                <button
                  onClick={() => fetchProject(true)}
                  disabled={refreshing}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <svg
                    className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
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
                  {refreshing ? "Refreshing..." : "Refresh"}
                </button>

                {/* Status Update Dropdown - Manager+ only */}
                {(isAdmin || isManager) && (
                  <div className="relative">
                    <select
                      value={project.status || ""}
                      onChange={(e) => handleStatusUpdate(e.target.value)}
                      disabled={statusUpdating}
                      className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50 appearance-none cursor-pointer"
                    >
                      <option value="Planning">Planning</option>
                      <option value="InProgress">In Progress</option>
                      <option value="OnHold">On Hold</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                    {statusUpdating && (
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      </div>
                    )}
                  </div>
                )}

                {(isAdmin || isManager) && (
                  <>
                    <button
                      onClick={() =>
                        navigate(`/projects/${projectId}/schedule`)
                      }
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
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
                      Schedule
                    </button>
                    {isManager && (
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2">
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
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        Edit
                      </button>
                    )}
                    {isAdmin && (
                      <button
                        onClick={handleDelete}
                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center gap-2"
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Delete
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* API Status & Last Updated Banner */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-blue-900">
                      Connected to Solar Projects API (localhost:5001)
                    </span>
                  </div>
                  <div className="text-sm text-blue-700">
                    Last updated:{" "}
                    {formatDate(project.updatedAt) ||
                      formatDate(project.createdAt)}
                  </div>
                </div>
              </div>

              {/* Error Banner */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5 text-red-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                    <div className="flex-1">
                      <h4 className="font-medium text-red-900">API Error</h4>
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                    <button
                      onClick={() => setError(null)}
                      className="text-red-500 hover:text-red-700"
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
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
              {/* Project Overview */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Project Overview
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Client
                    </label>
                    <p className="text-gray-900">
                      {project.clientInfo || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <p className="text-gray-900">
                      {project.address || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <p className="text-gray-900">
                      {formatDate(project.startDate)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estimated End Date
                    </label>
                    <p className="text-gray-900">
                      {formatDate(project.estimatedEndDate)}
                    </p>
                  </div>
                  {project.actualEndDate && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Actual End Date
                      </label>
                      <p className="text-gray-900">
                        {formatDate(project.actualEndDate)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress & Tasks */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Progress & Tasks
                </h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Overall Progress
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {project.completedTaskCount}
                      </div>
                      <div className="text-sm text-gray-600">
                        Completed Tasks
                      </div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-600">
                        {project.taskCount}
                      </div>
                      <div className="text-sm text-gray-600">Total Tasks</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Technical Specifications
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total Capacity
                    </label>
                    <p className="text-gray-900">
                      {project.totalCapacityKw
                        ? `${project.totalCapacityKw} kW`
                        : "Not specified"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      PV Module Count
                    </label>
                    <p className="text-gray-900">
                      {project.pvModuleCount || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Connection Type
                    </label>
                    <p className="text-gray-900">
                      {project.connectionType || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Team
                    </label>
                    <p className="text-gray-900">
                      {project.team || "Not assigned"}
                    </p>
                  </div>
                  {project.connectionNotes && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Connection Notes
                      </label>
                      <p className="text-gray-900">{project.connectionNotes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Equipment Details */}
              {project.equipmentDetails && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Equipment Details
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-xl font-bold text-gray-900">
                        {project.equipmentDetails.inverter125kw || 0}
                      </div>
                      <div className="text-sm text-gray-600">
                        125kW Inverters
                      </div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-xl font-bold text-gray-900">
                        {project.equipmentDetails.inverter80kw || 0}
                      </div>
                      <div className="text-sm text-gray-600">
                        80kW Inverters
                      </div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-xl font-bold text-gray-900">
                        {project.equipmentDetails.inverter60kw || 0}
                      </div>
                      <div className="text-sm text-gray-600">
                        60kW Inverters
                      </div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
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

              {/* Project Performance Metrics */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Project Performance
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {project.status === "Completed" ? "100" : progress}%
                    </div>
                    <div className="text-sm text-gray-600">Completion Rate</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {project.taskCount > 0
                        ? Math.ceil(
                            (new Date().getTime() -
                              new Date(project.startDate).getTime()) /
                              (1000 * 60 * 60 * 24)
                          )
                        : 0}
                    </div>
                    <div className="text-sm text-gray-600">Days Active</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {project.totalCapacityKw
                        ? `${project.totalCapacityKw}kW`
                        : "N/A"}
                    </div>
                    <div className="text-sm text-gray-600">Total Capacity</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Project Manager */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Project Manager
                </h3>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-lg">
                      {project.projectManager?.fullName
                        ?.charAt(0)
                        ?.toUpperCase() || "?"}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {project.projectManager?.fullName || "Not assigned"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {project.projectManager?.email || "No email"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Financial Information */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Financial Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      FTS Value
                    </label>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(project.ftsValue)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Revenue Value
                    </label>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(project.revenueValue)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      PQM Value
                    </label>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(project.pqmValue)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Location */}
              {project.locationCoordinates && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Location
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Latitude
                      </label>
                      <p className="text-gray-900">
                        {project.locationCoordinates.latitude}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Longitude
                      </label>
                      <p className="text-gray-900">
                        {project.locationCoordinates.longitude}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Project Metadata */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Project Info
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">
                      Project ID:
                    </span>
                    <p className="text-gray-600 font-mono">
                      {project.projectId}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Created:</span>
                    <p className="text-gray-600">
                      {formatDate(project.createdAt)}
                    </p>
                  </div>
                  {project.updatedAt && (
                    <div>
                      <span className="font-medium text-gray-700">
                        Last Updated:
                      </span>
                      <p className="text-gray-600">
                        {formatDate(project.updatedAt)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* API Integration Info */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  API Integration
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Endpoint:</span>
                    <p className="text-gray-600 font-mono text-xs">
                      GET /api/v1/projects/{project.projectId}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">
                      API Version:
                    </span>
                    <p className="text-gray-600">v1.0</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Base URL:</span>
                    <p className="text-gray-600 font-mono text-xs">
                      http://localhost:5001
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Auth:</span>
                    <p className="text-gray-600">JWT Bearer Token</p>
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={() =>
                        window.open("http://localhost:5001/swagger", "_blank")
                      }
                      className="w-full bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors text-xs"
                    >
                      View API Documentation
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ProjectDetail;
