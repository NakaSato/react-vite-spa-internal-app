import React from "react";
import { ProjectDto } from "../../../shared/types/project";

interface EquipmentDetailsProps {
  project: ProjectDto;
}

const EquipmentDetails = ({ project }: EquipmentDetailsProps) => {
  if (!project.equipmentDetails) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Equipment Details
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-xl font-bold text-gray-900">
            {project.equipmentDetails.inverter125kw || 0}
          </div>
          <div className="text-sm text-gray-600">125kW Inverters</div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-xl font-bold text-gray-900">
            {project.equipmentDetails.inverter80kw || 0}
          </div>
          <div className="text-sm text-gray-600">80kW Inverters</div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-xl font-bold text-gray-900">
            {project.equipmentDetails.inverter60kw || 0}
          </div>
          <div className="text-sm text-gray-600">60kW Inverters</div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
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
