import React from "react";
import { useApi } from "../hooks/useApi";
import { SolarProject } from "../types/api";

const ApiExample: React.FC = () => {
  const {
    data: projects,
    loading,
    error,
    refetch,
  } = useApi<SolarProject[]>("/projects");

  const handleRefresh = () => {
    refetch();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading projects...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="text-red-600 mb-4">Error: {error}</div>
        <button
          onClick={handleRefresh}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Solar Projects</h2>
        <button
          onClick={handleRefresh}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Refresh
        </button>
      </div>

      {projects && projects.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-lg mb-2">{project.name}</h3>
              <p className="text-gray-600 mb-2">{project.description}</p>
              <div className="text-sm text-gray-500 space-y-1">
                <div>Capacity: {project.capacity} MW</div>
                <div>Location: {project.location}</div>
                <div>
                  Status:
                  <span
                    className={`ml-1 px-2 py-1 rounded text-xs ${
                      project.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : project.status === "in-progress"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 text-gray-500">No projects found</div>
      )}
    </div>
  );
};

export default ApiExample;
