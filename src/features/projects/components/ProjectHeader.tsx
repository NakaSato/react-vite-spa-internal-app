import React from "react";
import { useNavigate } from "react-router-dom";
import { getStatusBadgeColor } from "../utils/projectHelpers";
import { ProjectDto } from "../../../shared/types/project";

interface ProjectHeaderProps {
  project: ProjectDto;
  refreshing: boolean;
  onRefresh: () => void;
  onRefreshPerformance: () => void;
  onStatusUpdate: (status: string) => void;
  onDelete: () => void;
  onCreateTemplate: () => void;
  onAdvancedSearch: () => void;
  statusUpdating: boolean;
  loadingPerformance: boolean;
  showAdvancedActions: boolean;
  onToggleAdvancedActions: () => void;
  isAdmin: boolean;
  isManager: boolean;
}

const ProjectHeader = ({
  project,
  onCreateTemplate,
  onAdvancedSearch,
  showAdvancedActions,
}: ProjectHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center text-gray-600 transition-colors hover:text-gray-900"
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
          <div className="h-6 w-px bg-gray-300"></div>
          <h1 className="text-3xl font-bold text-gray-900">
            {project.projectName || "Unnamed Project"}
          </h1>
          <span
            className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusBadgeColor(
              project.status
            )}`}
          >
            {project.status || "Unknown"}
          </span>
        </div>

        {/* Advanced Actions Panel */}
        {showAdvancedActions && (
          <div className="mt-4 rounded-lg border bg-gray-50 p-4">
            <h4 className="mb-3 font-medium text-gray-900">Advanced Actions</h4>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={onCreateTemplate}
                className="flex items-center gap-2 rounded-md bg-orange-600 px-3 py-2 text-sm text-white transition-colors hover:bg-orange-700"
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Create Template
              </button>
              <button
                onClick={onAdvancedSearch}
                className="flex items-center gap-2 rounded-md bg-cyan-600 px-3 py-2 text-sm text-white transition-colors hover:bg-cyan-700"
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Advanced Search
              </button>
              <button
                onClick={() =>
                  window.open(
                    `http://localhost:5001/api/v1/projects/${project.projectId}/performance`,
                    "_blank"
                  )
                }
                className="flex items-center gap-2 rounded-md bg-pink-600 px-3 py-2 text-sm text-white transition-colors hover:bg-pink-700"
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
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                API Docs
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectHeader;
