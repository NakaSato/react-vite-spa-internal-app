import React from "react";
import { ProjectDto } from "../../../shared/types/project";
import { calculateProgress } from "../utils/projectHelpers";

interface ProjectProgressProps {
  project: ProjectDto;
}

const ProjectProgress = ({ project }: ProjectProgressProps) => {
  const progress = calculateProgress(
    project.completedTaskCount,
    project.taskCount
  );

  return (
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
            <div className="text-sm text-gray-600">Completed Tasks</div>
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
  );
};

export default ProjectProgress;
