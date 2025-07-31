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
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">
        Progress & Tasks
      </h2>
      <div className="space-y-4">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Overall Progress
            </span>
            <span className="text-sm font-semibold text-gray-900">
              {progress}%
            </span>
          </div>
          <div className="h-3 w-full rounded-full bg-gray-200">
            <div
              className="h-3 rounded-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-blue-50 p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {project.completedTaskCount}
            </div>
            <div className="text-sm text-gray-600">Completed Tasks</div>
          </div>
          <div className="rounded-lg bg-gray-50 p-4 text-center">
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
