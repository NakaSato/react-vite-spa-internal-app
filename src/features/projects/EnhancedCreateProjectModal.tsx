import React, { useState, useEffect } from "react";
import { SolarProjectTemplateService } from "../../shared/utils/solarProjectTemplate";
import {
  CreateProjectRequest,
  SolarProjectDetails,
  ProjectEntity,
  ProjectStatus,
} from "../../shared/types/project-management";

interface CreateProjectModalProps {
  showModal: boolean;
  onClose: () => void;
  onCreateProject: (projectRequest: CreateProjectRequest) => Promise<void>;
  isLoading?: boolean;
}

interface SolarProjectFormData {
  // Basic Information
  projectName: string;
  projectOwner: string;
  mainContractor: string;

  // Scheduling
  plannedStartDate: string;
  plannedEndDate: string;

  // Technical Details
  systemCapacityKw: number;
  location: string;
  address: string;
  latitude: number;
  longitude: number;
  connectionType: "LV" | "MV" | "HV";

  // Inverter Configuration
  inverter125Kw: number;
  inverter80Kw: number;
  inverter60Kw: number;
  inverter40Kw: number;

  // Financial
  totalBudget: number;
  estimatedProduction: number;

  // Additional Info
  description: string;
  specialRequirements: string;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  showModal,
  onClose,
  onCreateProject,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<SolarProjectFormData>({
    projectName: "",
    projectOwner: "PWA",
    mainContractor: "PEA",
    plannedStartDate: "",
    plannedEndDate: "",
    systemCapacityKw: 100,
    location: "",
    address: "",
    latitude: 0,
    longitude: 0,
    connectionType: "LV",
    inverter125Kw: 0,
    inverter80Kw: 0,
    inverter60Kw: 0,
    inverter40Kw: 1,
    totalBudget: 0,
    estimatedProduction: 0,
    description: "",
    specialRequirements: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [estimatedDuration, setEstimatedDuration] = useState<number>(120);

  // Auto-calculate estimated duration and end date when capacity changes
  useEffect(() => {
    const duration = SolarProjectTemplateService.estimateProjectDuration(
      formData.systemCapacityKw
    );
    setEstimatedDuration(duration);

    if (formData.plannedStartDate) {
      const startDate = new Date(formData.plannedStartDate);
      const endDate = new Date(
        startDate.getTime() + duration * 24 * 60 * 60 * 1000
      );
      setFormData((prev) => ({
        ...prev,
        plannedEndDate: endDate.toISOString().split("T")[0],
      }));
    }
  }, [formData.systemCapacityKw, formData.plannedStartDate]);

  // Auto-calculate estimated production
  useEffect(() => {
    // Rough estimate: 1 kW produces ~1,500 kWh per year in Thailand
    const production = formData.systemCapacityKw * 1500;
    setFormData((prev) => ({
      ...prev,
      estimatedProduction: production,
    }));
  }, [formData.systemCapacityKw]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.projectName.trim()) {
      newErrors.projectName = "Project name is required";
    }

    if (!formData.plannedStartDate) {
      newErrors.plannedStartDate = "Start date is required";
    }

    if (!formData.plannedEndDate) {
      newErrors.plannedEndDate = "End date is required";
    }

    if (formData.systemCapacityKw <= 0) {
      newErrors.systemCapacityKw = "System capacity must be greater than 0";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (formData.totalBudget <= 0) {
      newErrors.totalBudget = "Budget must be greater than 0";
    }

    const totalInverterCapacity =
      formData.inverter125Kw * 125 +
      formData.inverter80Kw * 80 +
      formData.inverter60Kw * 60 +
      formData.inverter40Kw * 40;

    if (totalInverterCapacity < formData.systemCapacityKw * 0.8) {
      newErrors.inverter40Kw =
        "Total inverter capacity should be at least 80% of system capacity";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof SolarProjectFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const projectRequest = SolarProjectTemplateService.createSolarProject({
        projectName: formData.projectName,
        projectOwner: formData.projectOwner,
        mainContractor: formData.mainContractor,
        plannedStartDate: new Date(formData.plannedStartDate),
        plannedEndDate: new Date(formData.plannedEndDate),
        systemCapacityKw: formData.systemCapacityKw,
        location: formData.location,
      });

      await onCreateProject(projectRequest);
      onClose();

      // Reset form
      setFormData({
        projectName: "",
        projectOwner: "PWA",
        mainContractor: "PEA",
        plannedStartDate: "",
        plannedEndDate: "",
        systemCapacityKw: 100,
        location: "",
        address: "",
        latitude: 0,
        longitude: 0,
        connectionType: "LV",
        inverter125Kw: 0,
        inverter80Kw: 0,
        inverter60Kw: 0,
        inverter40Kw: 1,
        totalBudget: 0,
        estimatedProduction: 0,
        description: "",
        specialRequirements: "",
      });
    } catch (error) {
      console.error("Failed to create project:", error);
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-8 py-6 border-b border-gray-200 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                🌞 Create New Solar Project
              </h2>
              <p className="text-gray-600 mt-1">
                Based on Master Project Template - {estimatedDuration} days
                estimated duration
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-3xl font-bold transition-colors"
              disabled={isLoading}
            >
              ×
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Basic Information */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              📋 Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  value={formData.projectName}
                  onChange={(e) =>
                    handleInputChange("projectName", e.target.value)
                  }
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.projectName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="e.g., Solar Rooftop Power Generation Project 1"
                />
                {errors.projectName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.projectName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.location ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="e.g., Doi Chom Thong Water Production Plant"
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Owner
                </label>
                <select
                  value={formData.projectOwner}
                  onChange={(e) =>
                    handleInputChange("projectOwner", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="PWA">
                    PWA (Provincial Waterworks Authority)
                  </option>
                  <option value="PEA">
                    PEA (Provincial Electricity Authority)
                  </option>
                  <option value="MEA">
                    MEA (Metropolitan Electricity Authority)
                  </option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Main Contractor
                </label>
                <select
                  value={formData.mainContractor}
                  onChange={(e) =>
                    handleInputChange("mainContractor", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="PEA">
                    PEA (Provincial Electricity Authority)
                  </option>
                  <option value="PWA">
                    PWA (Provincial Waterworks Authority)
                  </option>
                  <option value="Private">Private Contractor</option>
                </select>
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              📅 Project Schedule
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Planned Start Date *
                </label>
                <input
                  type="date"
                  value={formData.plannedStartDate}
                  onChange={(e) =>
                    handleInputChange("plannedStartDate", e.target.value)
                  }
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.plannedStartDate
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.plannedStartDate && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.plannedStartDate}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Planned End Date *
                </label>
                <input
                  type="date"
                  value={formData.plannedEndDate}
                  onChange={(e) =>
                    handleInputChange("plannedEndDate", e.target.value)
                  }
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.plannedEndDate ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.plannedEndDate && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.plannedEndDate}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Duration
                </label>
                <div className="px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg">
                  <span className="font-medium text-gray-900">
                    {estimatedDuration} days
                  </span>
                  <span className="text-sm text-gray-600 ml-2">
                    (Auto-calculated based on capacity)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              ⚡ Technical Specifications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  System Capacity (kW) *
                </label>
                <input
                  type="number"
                  value={formData.systemCapacityKw}
                  onChange={(e) =>
                    handleInputChange(
                      "systemCapacityKw",
                      Number(e.target.value)
                    )
                  }
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.systemCapacityKw
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  min="1"
                  step="0.1"
                />
                {errors.systemCapacityKw && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.systemCapacityKw}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Connection Type
                </label>
                <select
                  value={formData.connectionType}
                  onChange={(e) =>
                    handleInputChange(
                      "connectionType",
                      e.target.value as "LV" | "MV" | "HV"
                    )
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="LV">LV (Low Voltage)</option>
                  <option value="MV">MV (Medium Voltage)</option>
                  <option value="HV">HV (High Voltage)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Production (kWh/year)
                </label>
                <div className="px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg">
                  <span className="font-medium text-gray-900">
                    {formData.estimatedProduction.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Inverter Configuration */}
            <div className="mt-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Inverter Configuration
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    125kW Inverters
                  </label>
                  <input
                    type="number"
                    value={formData.inverter125Kw}
                    onChange={(e) =>
                      handleInputChange("inverter125Kw", Number(e.target.value))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    80kW Inverters
                  </label>
                  <input
                    type="number"
                    value={formData.inverter80Kw}
                    onChange={(e) =>
                      handleInputChange("inverter80Kw", Number(e.target.value))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    60kW Inverters
                  </label>
                  <input
                    type="number"
                    value={formData.inverter60Kw}
                    onChange={(e) =>
                      handleInputChange("inverter60Kw", Number(e.target.value))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    40kW Inverters
                  </label>
                  <input
                    type="number"
                    value={formData.inverter40Kw}
                    onChange={(e) =>
                      handleInputChange("inverter40Kw", Number(e.target.value))
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.inverter40Kw ? "border-red-500" : "border-gray-300"
                    }`}
                    min="0"
                  />
                  {errors.inverter40Kw && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.inverter40Kw}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                Total Inverter Capacity:{" "}
                {(
                  formData.inverter125Kw * 125 +
                  formData.inverter80Kw * 80 +
                  formData.inverter60Kw * 60 +
                  formData.inverter40Kw * 40
                ).toLocaleString()}{" "}
                kW
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              💰 Financial Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Budget (THB) *
                </label>
                <input
                  type="number"
                  value={formData.totalBudget}
                  onChange={(e) =>
                    handleInputChange("totalBudget", Number(e.target.value))
                  }
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.totalBudget ? "border-red-500" : "border-gray-300"
                  }`}
                  min="0"
                  step="1000"
                />
                {errors.totalBudget && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.totalBudget}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cost per kW (THB)
                </label>
                <div className="px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg">
                  <span className="font-medium text-gray-900">
                    {formData.systemCapacityKw > 0
                      ? (
                          formData.totalBudget / formData.systemCapacityKw
                        ).toLocaleString(undefined, {
                          maximumFractionDigits: 0,
                        })
                      : "0"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-6 rounded-xl border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              📝 Additional Information
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  rows={3}
                  placeholder="Brief description of the project objectives and scope..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Requirements
                </label>
                <textarea
                  value={formData.specialRequirements}
                  onChange={(e) =>
                    handleInputChange("specialRequirements", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  rows={2}
                  placeholder="Any special requirements, constraints, or considerations..."
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Project...
                </>
              ) : (
                <>
                  <span>🚀 Create Project</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;
