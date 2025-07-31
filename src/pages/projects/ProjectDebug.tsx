import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProjects } from "@hooks/useProjects";
import { projectsApi } from "@shared/utils/projectsApi";
import { useAuth } from "@hooks/useAuth";
import ProtectedRoute from "@features/auth/ProtectedRoute";

const ProjectDebug: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, token } = useAuth();
  const { projects, loading, error } = useProjects();
  const [apiTest, setApiTest] = useState<any>(null);
  const [testLoading, setTestLoading] = useState(false);

  // Test API connection
  useEffect(() => {
    const testApiConnection = async () => {
      setTestLoading(true);
      try {
        console.log("🧪 [ProjectDebug] Testing API connection...");
        const result = await projectsApi.getAllProjects();
        setApiTest({
          success: true,
          totalCount: result.totalCount,
          itemCount: result.items?.length || 0,
          sampleProjectIds:
            result.items?.slice(0, 3).map((p) => p.projectId) || [],
          fullResponse: result,
        });
      } catch (err) {
        setApiTest({
          success: false,
          error: err instanceof Error ? err.message : "Unknown error",
          details: err,
        });
      } finally {
        setTestLoading(false);
      }
    };

    testApiConnection();
  }, []);

  const testProjectById = async (projectId: string) => {
    try {
      console.log(`🧪 [ProjectDebug] Testing project ID: ${projectId}`);
      const project = await projectsApi.getProjectById(projectId);
      console.log(`✅ [ProjectDebug] Project found:`, project);
      navigate(`/projects/${projectId}`);
    } catch (err) {
      console.error(
        `❌ [ProjectDebug] Failed to fetch project ${projectId}:`,
        err
      );
      alert(
        `Failed to fetch project ${projectId}: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <button
              onClick={() => navigate("/dashboard")}
              className="mb-4 flex items-center text-gray-600 transition-colors hover:text-gray-900"
            >
              <svg
                className="mr-2 h-5 w-5"
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
            <h1 className="text-3xl font-bold text-gray-900">
              Project API Debug
            </h1>
            <p className="mt-2 text-gray-600">
              Debug project ID matching and API connectivity
            </p>
          </div>

          {/* Authentication Status */}
          <div className="mb-6 rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              Authentication Status
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Is Authenticated:</span>
                <span
                  className={`rounded-full px-3 py-1 text-sm font-medium ${
                    isAuthenticated
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {isAuthenticated ? "✅ Yes" : "❌ No"}
                </span>
              </div>
              {user && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">User:</span>
                    <span className="font-medium text-gray-900">
                      {user.fullName} ({user.username})
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Role:</span>
                    <span className="font-medium text-gray-900">
                      {user.roleName}
                    </span>
                  </div>
                </>
              )}
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Token Available:</span>
                <span
                  className={`rounded-full px-3 py-1 text-sm font-medium ${
                    token
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {token ? "✅ Yes" : "❌ No"}
                </span>
              </div>
              {!isAuthenticated && (
                <div className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> You must be logged in to access the
                    Projects API. The 400 Bad Request errors you're seeing are
                    likely due to missing authentication.{" "}
                    <button
                      onClick={() => navigate("/login")}
                      className="underline hover:no-underline"
                    >
                      Go to Login
                    </button>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* API Connection Test */}
          <div className="mb-6 rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              API Connection Test
            </h2>

            {testLoading ? (
              <div className="flex items-center">
                <div className="mr-3 h-5 w-5 animate-spin rounded-full border-b-2 border-blue-600"></div>
                <span>Testing API connection...</span>
              </div>
            ) : apiTest ? (
              <div className="space-y-4">
                <div
                  className={`rounded-lg p-4 ${
                    apiTest.success
                      ? "border border-green-200 bg-green-50"
                      : "border border-red-200 bg-red-50"
                  }`}
                >
                  <div className="mb-2 flex items-center">
                    <span
                      className={`mr-2 text-2xl ${
                        apiTest.success ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {apiTest.success ? "✅" : "❌"}
                    </span>
                    <span
                      className={`font-medium ${
                        apiTest.success ? "text-green-800" : "text-red-800"
                      }`}
                    >
                      {apiTest.success
                        ? "API Connection Successful"
                        : "API Connection Failed"}
                    </span>
                  </div>

                  {apiTest.success ? (
                    <div className="text-sm text-green-700">
                      <p>
                        <strong>Total Projects:</strong> {apiTest.totalCount}
                      </p>
                      <p>
                        <strong>Items Returned:</strong> {apiTest.itemCount}
                      </p>
                      <p>
                        <strong>Sample Project IDs:</strong>
                      </p>
                      <ul className="ml-6 mt-2 list-disc">
                        {apiTest.sampleProjectIds.map(
                          (id: string, index: number) => (
                            <li key={index} className="font-mono text-xs">
                              {id}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  ) : (
                    <div className="text-sm text-red-700">
                      <p>
                        <strong>Error:</strong> {apiTest.error}
                      </p>
                    </div>
                  )}
                </div>

                {apiTest.success && (
                  <details className="rounded-lg bg-gray-50 p-4">
                    <summary className="cursor-pointer font-medium text-gray-700">
                      View Full API Response
                    </summary>
                    <pre className="mt-4 max-h-64 overflow-auto rounded border bg-white p-4 text-xs">
                      {JSON.stringify(apiTest.fullResponse, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ) : null}
          </div>

          {/* useProjects Hook Data */}
          <div className="mb-6 rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              useProjects Hook Data
            </h2>

            {loading ? (
              <div className="flex items-center">
                <div className="mr-3 h-5 w-5 animate-spin rounded-full border-b-2 border-blue-600"></div>
                <span>Loading projects from hook...</span>
              </div>
            ) : error ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <span className="text-red-600">❌ Hook Error: {error}</span>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <span className="text-blue-800">
                    ✅ Hook loaded {projects.length} projects
                  </span>
                </div>

                {projects.length > 0 ? (
                  <div>
                    <h3 className="mb-3 font-medium text-gray-900">
                      Available Projects:
                    </h3>
                    <div className="grid gap-4">
                      {projects.slice(0, 5).map((project) => (
                        <div
                          key={project.projectId}
                          className="rounded-lg border p-4 hover:bg-gray-50"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {project.projectName || "Unnamed Project"}
                              </h4>
                              <p className="font-mono text-sm text-gray-600">
                                ID: {project.projectId}
                              </p>
                              <p className="text-sm text-gray-600">
                                Status: {project.status}
                              </p>
                            </div>
                            <button
                              onClick={() => testProjectById(project.projectId)}
                              className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                            >
                              Test This Project
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {projects.length > 5 && (
                      <p className="mt-4 text-sm text-gray-600">
                        ... and {projects.length - 5} more projects
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                    <span className="text-yellow-800">
                      ⚠️ No projects found in hook data
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Manual Project ID Test */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              Manual Project ID Test
            </h2>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Enter project ID to test..."
                className="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    const target = e.target as HTMLInputElement;
                    if (target.value.trim()) {
                      testProjectById(target.value.trim());
                    }
                  }
                }}
              />
              <button
                onClick={() => {
                  const input = document.querySelector(
                    'input[placeholder*="Enter project ID"]'
                  ) as HTMLInputElement;
                  if (input?.value.trim()) {
                    testProjectById(input.value.trim());
                  }
                }}
                className="rounded-md bg-green-600 px-6 py-2 text-white transition-colors hover:bg-green-700"
              >
                Test Project ID
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Enter a project ID to test if it can be fetched from the API
            </p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ProjectDebug;
