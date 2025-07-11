import React, { useState } from "react";
import { projectsApi } from "../shared/utils/projectsApi";
import { env } from "../shared/config/env";

const ApiDebugTest: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [testing, setTesting] = useState(false);

  const addResult = (message: string) => {
    setTestResults((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  const testApiConnection = async () => {
    setTesting(true);
    setTestResults([]);

    try {
      addResult("🔧 Starting API connection test...");
      addResult(`🔗 API Base URL: ${env.API_BASE_URL}`);
      addResult(`🔗 Environment: ${env.ENVIRONMENT}`);

      // Test basic endpoint
      addResult("📡 Testing basic API connection...");

      // Try to fetch all projects first
      try {
        addResult("📋 Attempting to fetch all projects...");
        const allProjectsResponse = await projectsApi.getAllProjects({
          pageSize: 1,
        });
        addResult(
          `✅ All projects endpoint working. Total count: ${allProjectsResponse.totalCount}`
        );

        if (allProjectsResponse.items && allProjectsResponse.items.length > 0) {
          const firstProject = allProjectsResponse.items[0];
          addResult(
            `📄 Found project: ${firstProject.projectName} (ID: ${firstProject.projectId})`
          );

          // Now try to fetch this specific project by ID
          addResult(
            `🔍 Testing project detail fetch for ID: ${firstProject.projectId}`
          );
          try {
            const projectDetail = await projectsApi.getProjectById(
              firstProject.projectId
            );
            addResult(
              `✅ Project detail fetch successful: ${projectDetail.projectName}`
            );
          } catch (detailError) {
            addResult(
              `❌ Project detail fetch failed: ${
                detailError instanceof Error
                  ? detailError.message
                  : String(detailError)
              }`
            );
          }
        } else {
          addResult("⚠️ No projects found in the database");
        }
      } catch (projectsError) {
        addResult(
          `❌ All projects endpoint failed: ${
            projectsError instanceof Error
              ? projectsError.message
              : String(projectsError)
          }`
        );
      }
    } catch (error) {
      addResult(
        `❌ API test failed: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    } finally {
      setTesting(false);
    }
  };

  const testSpecificProjectId = async () => {
    const testId = "c139be92-54f6-45fa-ac99-d4aa51620d13"; // The ID from the error
    setTesting(true);

    try {
      addResult(`🔍 Testing specific project ID: ${testId}`);
      const project = await projectsApi.getProjectById(testId);
      addResult(`✅ Success: ${project.projectName}`);
    } catch (error) {
      addResult(
        `❌ Failed: ${error instanceof Error ? error.message : String(error)}`
      );
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          API Debug Test
        </h2>

        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={testApiConnection}
              disabled={testing}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {testing ? "Testing..." : "Test API Connection"}
            </button>

            <button
              onClick={testSpecificProjectId}
              disabled={testing}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {testing ? "Testing..." : "Test Specific Project ID"}
            </button>
          </div>
        </div>

        <div className="bg-gray-100 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Test Results</h3>
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {testResults.length === 0 ? (
              <p className="text-gray-500">
                No tests run yet. Click a button above to start testing.
              </p>
            ) : (
              testResults.map((result, index) => (
                <div
                  key={index}
                  className="text-sm font-mono bg-white p-2 rounded border"
                >
                  {result}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          <p>
            <strong>Current API Base URL:</strong> {env.API_BASE_URL}
          </p>
          <p>
            <strong>Environment:</strong> {env.ENVIRONMENT}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApiDebugTest;
