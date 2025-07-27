import React from "react";
import { ProjectDto } from "../../../shared/types/project";
import { formatDate } from "../utils/projectHelpers";

interface ProjectOverviewProps {
  project: ProjectDto;
}

const ProjectOverview = ({ project }: ProjectOverviewProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Project Overview
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Client
          </label>
          <p className="text-gray-900">
            {project.clientInfo || "Not specified"}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <p className="text-gray-900">{project.address || "Not specified"}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <p className="text-gray-900">{formatDate(project.startDate)}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estimated End Date
          </label>
          <p className="text-gray-900">
            {formatDate(project.estimatedEndDate)}
          </p>
        </div>
        {project.actualEndDate && (
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Actual End Date
            </label>
            <p className="text-gray-900">{formatDate(project.actualEndDate)}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectOverview;
