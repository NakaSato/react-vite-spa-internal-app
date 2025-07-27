import React from "react";
import { ProjectDto } from "../../../shared/types/project";

interface TechnicalSpecsProps {
  project: ProjectDto;
}

const TechnicalSpecs = ({ project }: TechnicalSpecsProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Technical Specifications
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total Capacity
          </label>
          <p className="text-gray-900">
            {project.totalCapacityKw
              ? `${project.totalCapacityKw} kW`
              : "Not specified"}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            PV Module Count
          </label>
          <p className="text-gray-900">
            {project.pvModuleCount || "Not specified"}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Connection Type
          </label>
          <p className="text-gray-900">
            {project.connectionType || "Not specified"}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Team
          </label>
          <p className="text-gray-900">{project.team || "Not assigned"}</p>
        </div>
        {project.connectionNotes && (
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
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
