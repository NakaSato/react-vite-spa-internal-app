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
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Project Manager
        </h3>
        {project.projectManager ? (
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
              <span className="font-medium text-blue-600">
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
          <div className="py-4 text-center text-gray-500">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
              <span className="text-gray-400">?</span>
            </div>
            <div className="text-sm">No manager assigned</div>
          </div>
        )}
      </div>

      {/* Financial Information */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Financial Information
        </h3>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
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
            <label className="mb-1 block text-sm font-medium text-gray-700">
              FTS Value
            </label>
            <p className="text-gray-900">
              {project.ftsValue !== null && project.ftsValue !== 0
                ? formatCurrency(project.ftsValue)
                : "Not specified"}
            </p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
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
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Technical Details
        </h3>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
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
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Connection Notes
              </label>
              <p className="text-sm text-gray-900">{project.connectionNotes}</p>
            </div>
          )}

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
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Project Information
        </h3>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Team Assignment
            </label>
            <p className="text-gray-900">{project.team || "Not assigned"}</p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Current Status
            </label>
            <p className="text-gray-900">{project.status || "Unknown"}</p>
          </div>

          {project.estimatedEndDate && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
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
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Location</h3>
          <div className="space-y-2">
            <div className="text-sm">
              <span className="font-medium text-gray-700">Coordinates:</span>
              <br />
              <span className="font-mono text-xs text-gray-900">
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
