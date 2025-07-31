import React from "react";
import { ProjectDto } from "../../../shared/types/project";
import { formatDate } from "../utils/projectHelpers";

interface ProjectOverviewProps {
  project: ProjectDto;
}

const ProjectOverview = ({ project }: ProjectOverviewProps) => {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">
        Project Overview
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Client
          </label>
          <p className="text-gray-900">
            {project.clientInfo || "Not specified"}
          </p>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Address
          </label>
          <p className="text-gray-900">{project.address || "Not specified"}</p>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <p className="text-gray-900">{formatDate(project.startDate)}</p>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Estimated End Date
          </label>
          <p className="text-gray-900">
            {formatDate(project.estimatedEndDate)}
          </p>
        </div>
        {project.actualEndDate && (
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">
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
