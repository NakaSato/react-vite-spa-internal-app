import React from "react";
import { CreateProjectRequest, ProjectDto } from "../../shared/types/project";

interface CreateProjectModalProps {
  showModal: boolean;
  newProject: CreateProjectRequest;
  onClose: () => void;
  onInputChange: (field: keyof CreateProjectRequest, value: any) => void;
  onCreateProject: () => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  showModal,
  newProject,
  onClose,
  onInputChange,
  onCreateProject,
}) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="m-4 max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-900">
              Create New Solar Project
            </h2>
            <button
              onClick={onClose}
              className="text-2xl font-bold text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-8">
          <form className="space-y-6">
            {/* Basic Information */}
            <div className="rounded-xl border bg-gradient-to-r from-blue-50 to-purple-50 p-6">
              <h3 className="mb-4 text-xl font-bold text-gray-900">
                📋 Basic Information
              </h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    value={newProject.projectName}
                    onChange={(e) =>
                      onInputChange("projectName", e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    placeholder="โรงพยาบาลปากน้ำ"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Address *
                  </label>
                  <input
                    type="text"
                    value={newProject.address}
                    onChange={(e) => onInputChange("address", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    placeholder="ต.บางหญ้าแพรก อ.เมืองสมุทรสาคร จ.สมุทรสาคร 74000"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Client Information *
                  </label>
                  <input
                    type="text"
                    value={newProject.clientInfo || ""}
                    onChange={(e) =>
                      onInputChange("clientInfo", e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    placeholder="โรงพยาบาลประจำจังหวัดสมุทรสาคร"
                  />
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="rounded-xl border bg-gradient-to-r from-green-50 to-blue-50 p-6">
              <h3 className="mb-4 text-xl font-bold text-gray-900">
                📅 Timeline
              </h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={newProject.startDate}
                    onChange={(e) => onInputChange("startDate", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Estimated End Date
                  </label>
                  <input
                    type="date"
                    value={newProject.estimatedEndDate || ""}
                    onChange={(e) =>
                      onInputChange("estimatedEndDate", e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Technical Specifications */}
            <div className="rounded-xl border bg-gradient-to-r from-yellow-50 to-orange-50 p-6">
              <h3 className="mb-4 text-xl font-bold text-gray-900">
                ⚡ Technical Specifications
              </h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Total Capacity (kW)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newProject.totalCapacityKw || 0}
                    onChange={(e) =>
                      onInputChange(
                        "totalCapacityKw",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    placeholder="875.0"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    PV Module Count
                  </label>
                  <input
                    type="number"
                    value={newProject.pvModuleCount || 0}
                    onChange={(e) =>
                      onInputChange(
                        "pvModuleCount",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    placeholder="1600"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Connection Type
                  </label>
                  <select
                    value={newProject.connectionType || "LV"}
                    onChange={(e) =>
                      onInputChange("connectionType", e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="LV">LV - Low Voltage</option>
                    <option value="MV">MV - Medium Voltage</option>
                    <option value="HV">HV - High Voltage</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Financial Information */}
            <div className="rounded-xl border bg-gradient-to-r from-purple-50 to-pink-50 p-6">
              <h3 className="mb-4 text-xl font-bold text-gray-900">
                💰 Financial Information
              </h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    FTS Value (฿)
                  </label>
                  <input
                    type="number"
                    value={newProject.ftsValue || 0}
                    onChange={(e) =>
                      onInputChange("ftsValue", parseFloat(e.target.value) || 0)
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    placeholder="16200000"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Revenue Value (฿)
                  </label>
                  <input
                    type="number"
                    value={newProject.revenueValue || 0}
                    onChange={(e) =>
                      onInputChange(
                        "revenueValue",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    placeholder="19440000"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    PQM Value (฿)
                  </label>
                  <input
                    type="number"
                    value={newProject.pqmValue || 0}
                    onChange={(e) =>
                      onInputChange("pqmValue", parseFloat(e.target.value) || 0)
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    placeholder="3240000"
                  />
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="rounded-xl border bg-gradient-to-r from-indigo-50 to-cyan-50 p-6">
              <h3 className="mb-4 text-xl font-bold text-gray-900">
                📍 Location & Connection
              </h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={newProject.latitude || 0}
                    onChange={(e) =>
                      onInputChange("latitude", parseFloat(e.target.value) || 0)
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    placeholder="13.5619"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={newProject.longitude || 0}
                    onChange={(e) =>
                      onInputChange(
                        "longitude",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    placeholder="100.2743"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Connection Notes
                  </label>
                  <textarea
                    value={newProject.connectionNotes || ""}
                    onChange={(e) =>
                      onInputChange("connectionNotes", e.target.value)
                    }
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    placeholder="ระบบจำหน่ายแรงสูง 22 kV"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 border-t border-gray-200 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onCreateProject}
                className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 font-bold text-white shadow-lg hover:from-blue-700 hover:to-purple-700"
              >
                Create Project
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectModal;
