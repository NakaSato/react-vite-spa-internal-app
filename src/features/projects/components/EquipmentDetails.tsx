import React from "react";
import { ProjectDto } from "../../../shared/types/project";

interface EquipmentDetailsProps {
  project: ProjectDto;
}

const EquipmentDetails = ({ project }: EquipmentDetailsProps) => {
  if (!project.equipmentDetails) return null;

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">
        Equipment Details
      </h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-lg bg-gray-50 p-4 text-center">
          <div className="text-xl font-bold text-gray-900">
            {project.equipmentDetails.inverter125kw || 0}
          </div>
          <div className="text-sm text-gray-600">125kW Inverters</div>
        </div>
        <div className="rounded-lg bg-gray-50 p-4 text-center">
          <div className="text-xl font-bold text-gray-900">
            {project.equipmentDetails.inverter80kw || 0}
          </div>
          <div className="text-sm text-gray-600">80kW Inverters</div>
        </div>
        <div className="rounded-lg bg-gray-50 p-4 text-center">
          <div className="text-xl font-bold text-gray-900">
            {project.equipmentDetails.inverter60kw || 0}
          </div>
          <div className="text-sm text-gray-600">60kW Inverters</div>
        </div>
        <div className="rounded-lg bg-gray-50 p-4 text-center">
          <div className="text-xl font-bold text-gray-900">
            {project.equipmentDetails.inverter40kw || 0}
          </div>
          <div className="text-sm text-gray-600">40kW Inverters</div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentDetails;
