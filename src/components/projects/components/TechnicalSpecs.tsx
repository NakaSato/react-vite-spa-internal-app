import React from "react";
import { ProjectDto } from "../../../shared/types/project";

interface TechnicalSpecsProps {
  project: ProjectDto;
}

const TechnicalSpecs = ({ project }: TechnicalSpecsProps) => {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">
        Technical Specifications
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Total Capacity
          </label>
          <p className="text-gray-900">
            {project.totalCapacityKw
              ? `${project.totalCapacityKw} kW`
              : "Not specified"}
          </p>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            PV Module Count
          </label>
          <p className="text-gray-900">
            {project.pvModuleCount || "Not specified"}
          </p>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Connection Type
          </label>
          <p className="text-gray-900">
            {project.connectionType || "Not specified"}
          </p>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Team
          </label>
          <p className="text-gray-900">{project.team || "Not assigned"}</p>
        </div>
        {project.connectionNotes && (
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Connection Notes
            </label>
            <p className="text-gray-900">{project.connectionNotes}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TechnicalSpecs;
