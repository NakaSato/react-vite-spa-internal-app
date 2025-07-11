import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ProjectDto } from "../shared/types/project";
import { projectsApi } from "../shared/utils/projectsApi";
import { mockProjects } from "../shared/data/mockProjects";
import { ProtectedRoute } from "../features/auth";
import { useAuth, useRole } from "../shared/hooks/useAuth";
import {
  getStatusColor,
  formatCurrency,
  formatCapacity,
} from "../shared/utils/projectHelpers";

const ProjectDetail: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isAdmin, isManager } = useRole();

  const [project, setProject] = useState<ProjectDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Convert mock project to ProjectDto format
  const convertMockToProjectDto = (mockProject: any): ProjectDto => {
    return {
      projectId: mockProject.id,
      projectName: mockProject.name,
      address: mockProject.location,
      clientInfo: mockProject.client,
      status: mockProject.status,
      startDate: mockProject.startDate,
      estimatedEndDate: mockProject.expectedCompletion,
      actualEndDate:
        mockProject.status === "Completed"
          ? mockProject.expectedCompletion
          : null,
      updatedAt: new Date().toISOString(),
      projectManager: {
        userId: "user-123",
        username: "manager_user",
        email: "manager@example.com",
        fullName: "Project Manager",
        roleId: 2,
        roleName: "Manager",
        isActive: true,
      },
      taskCount: 10,
      completedTaskCount: Math.floor(mockProject.progress / 10),
      team: mockProject.assignedTeam?.join(", ") || null,
      connectionType: "LV",
      connectionNotes: `${mockProject.systemSize} solar installation`,
      totalCapacityKw:
        parseFloat(mockProject.systemSize?.replace(/[^0-9.]/g, "")) || null,
      pvModuleCount: Math.floor(
        (parseFloat(mockProject.systemSize?.replace(/[^0-9.]/g, "")) || 0) * 4
      ),
      equipmentDetails: {
        inverter125kw: 0,
        inverter80kw: 0,
        inverter60kw: 1,
        inverter40kw: 0,
      },
      ftsValue: mockProject.budget * 0.1,
      revenueValue: mockProject.budget,
      pqmValue: mockProject.budget * 0.05,
      locationCoordinates: {
        latitude: 30.2672,
        longitude: -97.7431,
      },
      createdAt: mockProject.startDate,
    };
  };

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) {
        setError("Project ID is required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        console.log("🔍 [ProjectDetail] Fetching project:", projectId);
        console.log(
          "🔗 [ProjectDetail] API Base URL:",
          import.meta.env.VITE_API_BASE_URL || "using default"
        );

        // First, try the API
        const projectData = await projectsApi.getProjectById(projectId);

        if (projectData) {
          setProject(projectData);
          console.log(
            "✅ [ProjectDetail] Project loaded from API:",
            projectData
          );
        } else {
          setError("Project not found or no data available");
        }
      } catch (err) {
        console.warn("⚠️ [ProjectDetail] API call failed, trying mock data...");

        // Fallback to mock data
        const mockProject = mockProjects.find(
          (p) => (p as any).id === projectId
        );
        if (mockProject) {
          const convertedProject = convertMockToProjectDto(mockProject);
          setProject(convertedProject);
          console.log(
            "✅ [ProjectDetail] Project loaded from mock data:",
            convertedProject
          );
        } else {
          let errorMessage = "Failed to load project";

          if (err instanceof Error) {
            errorMessage = err.message;
            console.error("❌ [ProjectDetail] Error details:", {
              message: err.message,
              stack: err.stack,
              projectId,
              apiUrl:
                import.meta.env.VITE_API_BASE_URL || "default (localhost:5001)",
            });
          } else if (typeof err === "string") {
            errorMessage = err;
          }

          // Check if it's an authentication error
          if (
            errorMessage.includes("401") ||
            errorMessage.includes("Authentication required")
          ) {
            errorMessage = `Authentication Error: Please log in to view project details.`;
          } else if (
            errorMessage.includes("403") ||
            errorMessage.includes("Access denied")
          ) {
            errorMessage = `Access Denied: You don't have permission to view this project.`;
          } else if (
            errorMessage.includes("404") ||
            errorMessage.includes("not found")
          ) {
            errorMessage = `Project Not Found: The project ID "${projectId}" does not exist. Try using a test ID like "P001", "P002", "P003", or "P004".`;
          } else if (
            errorMessage.includes("400") ||
            errorMessage.includes("Bad Request")
          ) {
            errorMessage = `API Error (400): The project ID "${projectId}" may not exist or the API endpoint is not available. Try using a test ID like "P001", "P002", "P003", or "P004".`;
          } else if (errorMessage.includes("fetch")) {
            errorMessage = `Network Error: Cannot connect to the API server. Please check if the API is running on the correct port. Try using a test ID like "P001", "P002", "P003", or "P004".`;
          }

          setError(errorMessage);
          console.error("❌ [ProjectDetail] Error fetching project:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  const handleEditProject = () => {
    // Navigate to edit mode or open edit modal
    console.log("🔧 [ProjectDetail] Edit project:", project?.projectId);
    // TODO: Implement edit functionality
  };

  const handleDeleteProject = () => {
    // Show confirmation dialog and delete project
    console.log("🗑️ [ProjectDetail] Delete project:", project?.projectId);
    // TODO: Implement delete functionality
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading project details...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Error Loading Project
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!project) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-gray-400 text-6xl mb-4">📂</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Project Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The requested project could not be found.
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const progressPercentage =
    project.taskCount > 0
      ? Math.round((project.completedTaskCount / project.taskCount) * 100)
      : 0;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {project.projectName}
                  </h1>
                  <p className="text-sm text-gray-600">
                    Project ID: {project.projectId}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                    project.status
                  )}`}
                >
                  {project.status || "Unknown"}
                </span>

                {(isAdmin || isManager) && (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleEditProject}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      ✏️ Edit Project
                    </button>
                    {isAdmin && (
                      <button
                        onClick={handleDeleteProject}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                      >
                        🗑️ Delete
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Project Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Project Overview */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Project Overview
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Client Information
                    </h3>
                    <p className="text-gray-900">
                      {project.clientInfo || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Project Address
                    </h3>
                    <p className="text-gray-900">
                      {project.address || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Start Date
                    </h3>
                    <p className="text-gray-900">
                      {project.startDate
                        ? new Date(project.startDate).toLocaleDateString()
                        : "Not set"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Estimated End Date
                    </h3>
                    <p className="text-gray-900">
                      {project.estimatedEndDate
                        ? new Date(
                            project.estimatedEndDate
                          ).toLocaleDateString()
                        : "Not set"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress Section */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Progress Overview
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">
                      Overall Progress
                    </span>
                    <span className="text-2xl font-bold text-gray-900">
                      {progressPercentage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{project.completedTaskCount} completed tasks</span>
                    <span>{project.taskCount} total tasks</span>
                  </div>
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Technical Specifications
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Total Capacity
                    </h3>
                    <p className="text-gray-900 font-medium">
                      {project.totalCapacityKw
                        ? formatCapacity(project.totalCapacityKw)
                        : "Not specified"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      PV Modules
                    </h3>
                    <p className="text-gray-900 font-medium">
                      {project.pvModuleCount || 0} modules
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Connection Type
                    </h3>
                    <p className="text-gray-900 font-medium">
                      {project.connectionType || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Location
                    </h3>
                    <p className="text-gray-900 font-medium">
                      {project.locationCoordinates &&
                      project.locationCoordinates.latitude &&
                      project.locationCoordinates.longitude
                        ? `${project.locationCoordinates.latitude.toFixed(
                            4
                          )}, ${project.locationCoordinates.longitude.toFixed(
                            4
                          )}`
                        : "Not specified"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Equipment Details */}
              {project.equipmentDetails &&
                (project.equipmentDetails.inverter125kw > 0 ||
                  project.equipmentDetails.inverter80kw > 0 ||
                  project.equipmentDetails.inverter60kw > 0 ||
                  project.equipmentDetails.inverter40kw > 0) && (
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                      Inverter Configuration
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {project.equipmentDetails.inverter125kw > 0 && (
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">
                            {project.equipmentDetails.inverter125kw}
                          </div>
                          <div className="text-sm text-gray-600">
                            125kW Inverters
                          </div>
                        </div>
                      )}
                      {project.equipmentDetails.inverter80kw > 0 && (
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            {project.equipmentDetails.inverter80kw}
                          </div>
                          <div className="text-sm text-gray-600">
                            80kW Inverters
                          </div>
                        </div>
                      )}
                      {project.equipmentDetails.inverter60kw > 0 && (
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">
                            {project.equipmentDetails.inverter60kw}
                          </div>
                          <div className="text-sm text-gray-600">
                            60kW Inverters
                          </div>
                        </div>
                      )}
                      {project.equipmentDetails.inverter40kw > 0 && (
                        <div className="text-center p-4 bg-orange-50 rounded-lg">
                          <div className="text-2xl font-bold text-orange-600">
                            {project.equipmentDetails.inverter40kw}
                          </div>
                          <div className="text-sm text-gray-600">
                            40kW Inverters
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Project Manager */}
              {project.projectManager && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">
                    Project Manager
                  </h2>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium">
                        {project.projectManager.fullName
                          ? project.projectManager.fullName
                              .charAt(0)
                              .toUpperCase()
                          : project.projectManager.username
                              .charAt(0)
                              .toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {project.projectManager.fullName ||
                          project.projectManager.username}
                      </div>
                      <div className="text-sm text-gray-500">
                        {project.projectManager.email}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Financial Information */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Financial Overview
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Revenue Value</span>
                    <span className="font-medium text-gray-900">
                      {project.revenueValue
                        ? formatCurrency(project.revenueValue)
                        : "Not set"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">FTS Value</span>
                    <span className="font-medium text-gray-900">
                      {project.ftsValue
                        ? formatCurrency(project.ftsValue)
                        : "Not set"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">PQM Value</span>
                    <span className="font-medium text-gray-900">
                      {project.pqmValue
                        ? formatCurrency(project.pqmValue)
                        : "Not set"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Connection Notes */}
              {project.connectionNotes && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">
                    Connection Notes
                  </h2>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {project.connectionNotes}
                  </p>
                </div>
              )}

              {/* Timestamps */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Project Timeline
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Created</span>
                    <span className="text-sm text-gray-900">
                      {project.createdAt
                        ? new Date(project.createdAt).toLocaleDateString()
                        : "Unknown"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Last Updated</span>
                    <span className="text-sm text-gray-900">
                      {project.updatedAt
                        ? new Date(project.updatedAt).toLocaleDateString()
                        : "Unknown"}
                    </span>
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
