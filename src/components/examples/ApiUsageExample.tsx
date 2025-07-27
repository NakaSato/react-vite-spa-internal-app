import React, { useState } from "react";
import { solarProjectApi } from "../../shared/api/solarProjectApiRefactored";

/**
 * Example component showing the new modular API usage
 * This demonstrates how to migrate from the old monolithic API
 */
export const ApiUsageExample: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Example: Authentication
  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // NEW MODULAR API USAGE:
      const response = await solarProjectApi.auth.login({
        username: "demo@example.com",
        password: "demo123",
      });

      if (response.success) {
        // Set the token for subsequent requests
        solarProjectApi.setAuthToken(response.data.token);
        setData(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Example: Projects
  const loadProjects = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // NEW MODULAR API USAGE:
      const response = await solarProjectApi.projects.getProjects({
        pageNumber: 1,
        pageSize: 10,
        sortBy: "createdAt",
        sortOrder: "desc",
      });

      if (response.success) {
        setData(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load projects");
    } finally {
      setIsLoading(false);
    }
  };

  // Example: Daily Reports
  const loadDailyReports = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // NEW MODULAR API USAGE:
      const response = await solarProjectApi.dailyReports.getDailyReports({
        PageNumber: 1,
        PageSize: 20,
        SortBy: "reportDate",
        SortOrder: "desc",
      });

      if (response.success) {
        setData(response.data);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load daily reports"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Example: Dashboard Overview
  const loadDashboard = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // NEW MODULAR API USAGE:
      const response = await solarProjectApi.utility.getDashboardOverview();

      if (response.success) {
        setData(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        New Modular API Usage Examples
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Test Auth Login
        </button>

        <button
          onClick={loadProjects}
          disabled={isLoading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          Load Projects
        </button>

        <button
          onClick={loadDailyReports}
          disabled={isLoading}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
        >
          Load Daily Reports
        </button>

        <button
          onClick={loadDashboard}
          disabled={isLoading}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
        >
          Load Dashboard
        </button>
      </div>

      {/* Migration Examples */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-3">Migration Examples:</h3>

        <div className="space-y-3 text-sm">
          <div>
            <div className="text-red-600 line-through">
              ❌ Old: solarProjectApi.login(credentials)
            </div>
            <div className="text-green-600">
              ✅ New: solarProjectApi.auth.login(credentials)
            </div>
          </div>

          <div>
            <div className="text-red-600 line-through">
              ❌ Old: solarProjectApi.getProjects(params)
            </div>
            <div className="text-green-600">
              ✅ New: solarProjectApi.projects.getProjects(params)
            </div>
          </div>

          <div>
            <div className="text-red-600 line-through">
              ❌ Old: solarProjectApi.getDailyReports(params)
            </div>
            <div className="text-green-600">
              ✅ New: solarProjectApi.dailyReports.getDailyReports(params)
            </div>
          </div>
        </div>
      </div>

      {/* Loading/Error/Data Display */}
      {isLoading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
      )}

      {data && !isLoading && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <h4 className="font-semibold mb-2">Response Data:</h4>
          <pre className="text-xs overflow-auto max-h-40">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
