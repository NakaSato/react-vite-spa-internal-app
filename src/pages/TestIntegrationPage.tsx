import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockProjects } from "../shared/data/mockProjects";
import { projectsApi } from "../shared/utils/projectsApi";
import { apiClient } from "../shared/utils/apiClient";

const TestIntegrationPage: React.FC = () => {
  const navigate = useNavigate();
  const [testResults, setTestResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const addTestResult = (test: string, status: "success" | "error" | "warning", message: string, data?: any) => {
    setTestResults(prev => [...prev, {
      timestamp: new Date().toISOString(),
      test,
      status,
      message,
      data
    }]);
  };

  const runApiConnectivityTest = async () => {
    setLoading(true);
    addTestResult("API Connectivity", "warning", "Starting API connectivity test...");

    try {
      // Test basic API connectivity by trying to fetch projects
      const projects = await projectsApi.getAllProjects({ pageSize: 1 });
      addTestResult("API Health Check", "success", "API connectivity test passed", { baseUrl: import.meta.env.VITE_API_BASE_URL });
    } catch (error) {
      addTestResult("API Health Check", "error", `API connectivity test failed: ${error instanceof Error ? error.message : String(error)}`);
    }

    try {
      const projects = await projectsApi.getAllProjects({ pageSize: 5 });
      addTestResult("Projects API", "success", `Successfully fetched ${projects.items?.length || 0} projects`, {
        totalCount: projects.totalCount,
        pageSize: projects.pageSize
      });
    } catch (error) {
      addTestResult("Projects API", "error", `Projects API failed: ${error instanceof Error ? error.message : String(error)}`);
    }

    setLoading(false);
  };

  const runProjectDetailTest = async () => {
    setLoading(true);
    addTestResult("Project Detail Test", "warning", "Testing project detail functionality...");

    // Test with mock project IDs
    const testIds = ["P001", "P002", "P003", "P004"];
    
    for (const projectId of testIds) {
      try {
        const project = await projectsApi.getProjectById(projectId);
        addTestResult(`Project Detail ${projectId}`, "success", `Successfully fetched project: ${project.projectName}`, {
          projectId: project.projectId,
          status: project.status,
          client: project.clientInfo
        });
      } catch (error) {
        addTestResult(`Project Detail ${projectId}`, "error", `Failed to fetch project ${projectId}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    setLoading(false);
  };

  const runMockDataTest = () => {
    addTestResult("Mock Data Test", "warning", "Testing mock data availability...");
    
    try {
      addTestResult("Mock Projects", "success", `Mock data contains ${mockProjects.length} projects`, {
        projectIds: mockProjects.map((p: any) => p.id),
        projects: mockProjects.map((p: any) => ({ id: p.id, name: p.name, status: p.status }))
      });
    } catch (error) {
      addTestResult("Mock Projects", "error", `Mock data test failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const runFullIntegrationTest = async () => {
    setTestResults([]);
    setLoading(true);
    
    addTestResult("Full Integration Test", "warning", "Starting comprehensive integration test...");
    
    // Run all tests
    runMockDataTest();
    await runApiConnectivityTest();
    await runProjectDetailTest();
    
    addTestResult("Full Integration Test", "success", "Integration test completed!");
    setLoading(false);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success": return "text-green-600 bg-green-50";
      case "error": return "text-red-600 bg-red-50";
      case "warning": return "text-yellow-600 bg-yellow-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success": return "✅";
      case "error": return "❌";
      case "warning": return "⚠️";
      default: return "ℹ️";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Integration Test Dashboard</h1>
              <p className="text-gray-600 mt-2">Comprehensive testing of API connectivity, project management, and mock data integration</p>
            </div>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>

          {/* Test Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <button
              onClick={runMockDataTest}
              disabled={loading}
              className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              Test Mock Data
            </button>
            <button
              onClick={runApiConnectivityTest}
              disabled={loading}
              className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              Test API Connectivity
            </button>
            <button
              onClick={runProjectDetailTest}
              disabled={loading}
              className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              Test Project Details
            </button>
            <button
              onClick={runFullIntegrationTest}
              disabled={loading}
              className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              Run Full Test
            </button>
          </div>

          {/* Test Navigation */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Quick Navigation</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {mockProjects.map((project: any) => (
                <button
                  key={project.id}
                  onClick={() => navigate(`/projects/${project.id}`)}
                  className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-left"
                >
                  <div className="font-medium text-sm">{project.id}</div>
                  <div className="text-xs text-gray-600 truncate">{project.name}</div>
                  <div className="text-xs text-blue-600">{project.status}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Test Results */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Test Results</h2>
              <div className="flex gap-2">
                <button
                  onClick={clearResults}
                  className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 transition-colors"
                >
                  Clear
                </button>
                <span className="text-sm text-gray-600">
                  {testResults.length} results
                </span>
              </div>
            </div>

            {loading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Running tests...</span>
              </div>
            )}

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-l-4 ${
                    result.status === "success"
                      ? "border-green-500 bg-green-50"
                      : result.status === "error"
                      ? "border-red-500 bg-red-50"
                      : "border-yellow-500 bg-yellow-50"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{getStatusIcon(result.status)}</span>
                    <span className="font-medium">{result.test}</span>
                    <span className="text-xs text-gray-500">{new Date(result.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{result.message}</p>
                  {result.data && (
                    <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  )}
                </div>
              ))}
            </div>

            {testResults.length === 0 && !loading && (
              <div className="text-center py-8 text-gray-500">
                No test results yet. Click a test button to begin.
              </div>
            )}
          </div>

          {/* Environment Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Environment Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <strong>API Base URL:</strong>
                <div className="text-gray-600">{import.meta.env.VITE_API_BASE_URL || "default (localhost:5001)"}</div>
              </div>
              <div>
                <strong>Environment:</strong>
                <div className="text-gray-600">{import.meta.env.VITE_ENV || "development"}</div>
              </div>
              <div>
                <strong>Mock Projects:</strong>
                <div className="text-gray-600">{mockProjects.length} available</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestIntegrationPage;
