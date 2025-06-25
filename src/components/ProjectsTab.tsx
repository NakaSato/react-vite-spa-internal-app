import React from "react";
import { Project } from "../types/project";
import { getStatusColor, getPriorityColor } from "../utils/projectHelpers";

interface ProjectsTabProps {
  projects: Project[];
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
    <div className="bg-white shadow-xl rounded-2xl border border-gray-200">
      <div className="px-8 py-6 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-3xl font-bold text-gray-900">All Projects</h3>
        {(isAdmin || isManager) && (
          <button
            onClick={onCreateProject}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105"
          >
            + New Project
          </button>
        )}
      </div>
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="flex justify-between items-start mb-6">
                <h4 className="text-xl font-bold text-gray-900 line-clamp-2">
                  {project.name}
                </h4>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(
                    project.status
                  )}`}
                >
                  {project.status}
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="mr-2">🏢</span>
                  <span className="font-medium">{project.client}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <span className="mr-2">📍</span>
                  <span className="font-medium">{project.location}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <span className="mr-2">⚡</span>
                  <span className="font-medium">{project.systemSize}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Progress:</span>
                  <span className="text-sm font-bold text-gray-900">
                    {project.progress}%
                  </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">
                      ${(project.budget / 1000).toFixed(0)}k
                    </div>
                    <div className="text-xs text-gray-500">Budget</div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityColor(
                      project.priority
                    )}`}
                  >
                    {project.priority}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {project.assignedTeam.map((team, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                    >
                      {team}
                    </span>
                  ))}
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
