import React from "react";
import { ProjectDto } from "../../shared/types/project";
import {
  getStatusColor,
  getPriorityColor,
} from "../../shared/utils/projectHelpers";

interface ProjectsTabProps {
  projects: ProjectDto[];
  isAdmin: boolean;
  isManager: boolean;
  onCreateProject: () => void;
}

const ProjectsTab: React.FC<ProjectsTabProps> = ({
  projects,
  isAdmin,
  isManager,
  onCreateProject,
}) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-xl">
      <div className="flex items-center justify-between border-b border-gray-200 px-8 py-6">
        <h3 className="text-3xl font-bold text-gray-900">All Projects</h3>
        {(isAdmin || isManager) && (
          <button
            onClick={onCreateProject}
            className="hover:shadow-3xl transform rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-lg font-bold text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-purple-700"
          >
            + New Project
          </button>
        )}
      </div>
      <div className="p-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.projectId}
              className="transform rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <div className="mb-6 flex items-start justify-between">
                <h4 className="line-clamp-2 text-xl font-bold text-gray-900">
                  {project.projectName || "Unnamed Project"}
                </h4>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusColor(
                    project.status || "Unknown"
                  )}`}
                >
                  {project.status || "Unknown"}
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="mr-2">🏢</span>
                  <span className="font-medium">
                    {project.clientInfo || "No client info"}
                  </span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <span className="mr-2">📍</span>
                  <span className="font-medium">
                    {project.address || "No address"}
                  </span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <span className="mr-2">⚡</span>
                  <span className="font-medium">
                    {project.totalCapacityKw
                      ? `${project.totalCapacityKw} kW`
                      : "No capacity info"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Progress:</span>
                  <span className="text-sm font-bold text-gray-900">
                    {project.taskCount > 0
                      ? Math.round(
                          (project.completedTaskCount / project.taskCount) * 100
                        )
                      : 0}
                    %
                  </span>
                </div>

                <div className="h-3 w-full rounded-full bg-gray-200">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                    style={{
                      width: `${
                        project.taskCount > 0
                          ? Math.round(
                              (project.completedTaskCount / project.taskCount) *
                                100
                            )
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>

                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">
                      $
                      {project.revenueValue
                        ? (project.revenueValue / 1000).toFixed(0)
                        : 0}
                      k
                    </div>
                    <div className="text-xs text-gray-500">Budget</div>
                  </div>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-800">
                    {project.connectionType || "Standard"}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {project.team && (
                    <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                      {project.team}
                    </span>
                  )}
                  {project.projectManager && (
                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                      PM:{" "}
                      {project.projectManager.fullName ||
                        project.projectManager.email}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsTab;
