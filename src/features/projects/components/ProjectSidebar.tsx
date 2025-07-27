import React from "react";
import { ProjectDto } from "../../../shared/types/project";
import { formatCurrency } from "../utils/projectHelpers";

interface ProjectSidebarProps {
  project: ProjectDto;
}

const ProjectSidebar = ({ project }: ProjectSidebarProps) => {
  return (
    <div className="space-y-6">
      {/* Project Manager */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Project Manager
        </h3>
        {project.projectManager ? (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-medium">
                {project.projectManager.fullName?.charAt(0) || "?"}
              </span>
            </div>
            <div>
              <div className="font-medium text-gray-900">
                {project.projectManager.fullName || "Unknown"}
              </div>
              <div className="text-sm text-gray-500">
                {project.projectManager.email || "No email"}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-gray-500 text-center py-4">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-gray-400">?</span>
            </div>
            <div className="text-sm">No manager assigned</div>
          </div>
        )}
      </div>

      {/* Financial Information */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Financial Information
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Revenue Value
            </label>
            <p className="text-gray-900">
              {project.revenueValue !== null && project.revenueValue !== 0
                ? formatCurrency(project.revenueValue)
                : project.totalCapacityKw
                ? formatCurrency(project.totalCapacityKw * 5000) +
                  " (estimated)"
                : "Not specified"}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              FTS Value
            </label>
            <p className="text-gray-900">
              {project.ftsValue !== null && project.ftsValue !== 0
                ? formatCurrency(project.ftsValue)
                : "Not specified"}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              PQM Value
            </label>
            <p className="text-gray-900">
              {project.pqmValue !== null && project.pqmValue !== 0
                ? formatCurrency(project.pqmValue)
                : "Not specified"}
            </p>
          </div>
        </div>
      </div>

      {/* Technical Details */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Technical Details
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Connection Type
            </label>
            <p className="text-gray-900">
              {project.connectionType || "Not specified"}
              {project.connectionType === "MV" && (
                <span className="ml-2 text-sm text-blue-600">
                  (Medium Voltage)
                </span>
              )}
            </p>
          </div>

          {project.connectionNotes && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Connection Notes
              </label>
              <p className="text-gray-900 text-sm">{project.connectionNotes}</p>
            </div>
          )}

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
              PV Modules
            </label>
            <p className="text-gray-900">
              {project.pvModuleCount || "Not specified"}
              {project.pvModuleCount && project.totalCapacityKw && (
                <span className="ml-2 text-sm text-gray-500">
                  (~
                  {(
                    (project.totalCapacityKw / project.pvModuleCount) *
                    1000
                  ).toFixed(0)}
                  W each)
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Project Info */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Project Information
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Team Assignment
            </label>
            <p className="text-gray-900">{project.team || "Not assigned"}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Status
            </label>
            <p className="text-gray-900">{project.status || "Unknown"}</p>
          </div>

          {project.estimatedEndDate && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estimated End Date
              </label>
              <p className="text-gray-900">
                {new Date(project.estimatedEndDate).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Location Information */}
      {project.locationCoordinates && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Location</h3>
          <div className="space-y-2">
            <div className="text-sm">
              <span className="font-medium text-gray-700">Coordinates:</span>
              <br />
              <span className="text-gray-900 font-mono text-xs">
                {project.locationCoordinates.latitude.toFixed(6)},{" "}
                {project.locationCoordinates.longitude.toFixed(6)}
              </span>
            </div>
            {project.address && (
              <div className="text-sm">
                <span className="font-medium text-gray-700">Address:</span>
                <br />
                <span className="text-gray-900">{project.address}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectSidebar;
