import React, { useState, useEffect } from "react";
import {
  useDailyReports,
  useDailyReportTemplates,
  useRole,
} from "../../shared/hooks";
import {
  CreateDailyReportRequest,
  DailyReportDto,
  WeatherCondition,
  DailyReportTaskProgress,
  DailyReportMaterialUsage,
} from "../../shared/types/project";

interface DailyReportFormProps {
  projectId: string;
  reportId?: string; // For editing existing reports
  onSave?: (report: DailyReportDto) => void;
  onCancel?: () => void;
}

const DailyReportForm: React.FC<DailyReportFormProps> = ({
  projectId,
  reportId,
  onSave,
  onCancel,
}) => {
  const { isAdmin, isManager } = useRole();
  const { createReport, updateReport, validateReport } =
    useDailyReports(projectId);
  const { templates } = useDailyReportTemplates(projectId);

  const [formData, setFormData] = useState<CreateDailyReportRequest>({
    projectId,
    reportDate: new Date().toISOString().split("T")[0],
    hoursWorked: 8,
    personnelOnSite: 1,
    weatherConditions: "Sunny",
    temperature: 72,
    humidity: 50,
    summary: "",
    workAccomplished: "",
    workPlannedNextDay: "",
    issues: "",
    safetyScore: 10,
    qualityScore: 10,
    dailyProgressContribution: 0,
    additionalNotes: "",
    tasksCompleted: [],
    materialsUsed: [],
  });

  const [validation, setValidation] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load existing report for editing
  useEffect(() => {
    if (reportId) {
      // TODO: Load existing report data
    }
  }, [reportId]);

  // Apply template defaults
  useEffect(() => {
    if (templates.length > 0 && !reportId) {
      const defaultTemplate =
        templates.find((t) => t.isDefault) || templates[0];
      if (defaultTemplate) {
        setFormData((prev) => ({
          ...prev,
          ...defaultTemplate.defaultValues,
        }));
      }
    }
  }, [templates, reportId]);

  const handleInputChange = (
    field: keyof CreateDailyReportRequest,
    value: any
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleTaskChange = (
    index: number,
    field: keyof DailyReportTaskProgress,
    value: any
  ) => {
    const updatedTasks = [...(formData.tasksCompleted || [])];
    updatedTasks[index] = { ...updatedTasks[index], [field]: value };
    setFormData((prev) => ({ ...prev, tasksCompleted: updatedTasks }));
  };

  const addTask = () => {
    const newTask: DailyReportTaskProgress = {
      taskId: `task-${Date.now()}`,
      title: "",
      completionPercentage: 0,
      notes: "",
    };
    setFormData((prev) => ({
      ...prev,
      tasksCompleted: [...(prev.tasksCompleted || []), newTask],
    }));
  };

  const removeTask = (index: number) => {
    const updatedTasks =
      formData.tasksCompleted?.filter((_, i) => i !== index) || [];
    setFormData((prev) => ({ ...prev, tasksCompleted: updatedTasks }));
  };

  const handleMaterialChange = (
    index: number,
    field: keyof DailyReportMaterialUsage,
    value: any
  ) => {
    const updatedMaterials = [...(formData.materialsUsed || [])];
    updatedMaterials[index] = { ...updatedMaterials[index], [field]: value };
    setFormData((prev) => ({ ...prev, materialsUsed: updatedMaterials }));
  };

  const addMaterial = () => {
    const newMaterial: DailyReportMaterialUsage = {
      materialId: `material-${Date.now()}`,
      name: "",
      quantity: 0,
      unit: "",
      unitCost: 0,
      totalCost: 0,
      notes: "",
    };
    setFormData((prev) => ({
      ...prev,
      materialsUsed: [...(prev.materialsUsed || []), newMaterial],
    }));
  };

  const removeMaterial = (index: number) => {
    const updatedMaterials =
      formData.materialsUsed?.filter((_, i) => i !== index) || [];
    setFormData((prev) => ({ ...prev, materialsUsed: updatedMaterials }));
  };

  const validateForm = async () => {
    const result = await validateReport(formData);
    setValidation(result);

    if (result && !result.isValid) {
      const fieldErrors: Record<string, string> = {};
      result.errors.forEach((error) => {
        fieldErrors[error.field] = error.message;
      });
      setErrors(fieldErrors);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const isValid = await validateForm();
      if (!isValid) {
        setIsSubmitting(false);
        return;
      }

      let result;
      if (reportId) {
        result = await updateReport(reportId, formData);
      } else {
        result = await createReport(formData);
      }

      if (result && onSave) {
        onSave(result);
      }
    } catch (error) {
      console.error("Error saving report:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl rounded-lg bg-white shadow-lg">
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-xl font-semibold text-gray-900">
          {reportId ? "Edit Daily Report" : "Create Daily Report"}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 p-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Report Date *
            </label>
            <input
              type="date"
              value={formData.reportDate}
              onChange={(e) => handleInputChange("reportDate", e.target.value)}
              className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                errors.reportDate ? "border-red-300" : ""
              }`}
              required
            />
            {errors.reportDate && (
              <p className="mt-1 text-sm text-red-600">{errors.reportDate}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Hours Worked *
            </label>
            <input
              type="number"
              min="0"
              max="24"
              step="0.5"
              value={formData.hoursWorked}
              onChange={(e) =>
                handleInputChange("hoursWorked", parseFloat(e.target.value))
              }
              className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                errors.hoursWorked ? "border-red-300" : ""
              }`}
              required
            />
            {errors.hoursWorked && (
              <p className="mt-1 text-sm text-red-600">{errors.hoursWorked}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Personnel on Site
            </label>
            <input
              type="number"
              min="1"
              value={formData.personnelOnSite}
              onChange={(e) =>
                handleInputChange("personnelOnSite", parseInt(e.target.value))
              }
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Daily Progress Contribution (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={formData.dailyProgressContribution}
              onChange={(e) =>
                handleInputChange(
                  "dailyProgressContribution",
                  parseFloat(e.target.value)
                )
              }
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Weather Information */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="mb-4 text-lg font-medium text-gray-900">
            Weather Conditions
          </h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Weather
              </label>
              <select
                value={formData.weatherConditions}
                onChange={(e) =>
                  handleInputChange("weatherConditions", e.target.value)
                }
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                {Object.values(WeatherCondition).map((condition) => (
                  <option key={condition} value={condition}>
                    {condition.replace(/([A-Z])/g, " $1").trim()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Temperature (°F)
              </label>
              <input
                type="number"
                value={formData.temperature || ""}
                onChange={(e) =>
                  handleInputChange(
                    "temperature",
                    parseFloat(e.target.value) || undefined
                  )
                }
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Humidity (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.humidity || ""}
                onChange={(e) =>
                  handleInputChange(
                    "humidity",
                    parseInt(e.target.value) || undefined
                  )
                }
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Work Summary */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="mb-4 text-lg font-medium text-gray-900">
            Work Summary
          </h3>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Summary *
              </label>
              <textarea
                rows={3}
                value={formData.summary}
                onChange={(e) => handleInputChange("summary", e.target.value)}
                placeholder="Brief summary of work completed today..."
                className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                  errors.summary ? "border-red-300" : ""
                }`}
                required
              />
              {errors.summary && (
                <p className="mt-1 text-sm text-red-600">{errors.summary}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Work Accomplished
              </label>
              <textarea
                rows={3}
                value={formData.workAccomplished || ""}
                onChange={(e) =>
                  handleInputChange("workAccomplished", e.target.value)
                }
                placeholder="Detailed description of work accomplished..."
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Work Planned for Next Day
              </label>
              <textarea
                rows={3}
                value={formData.workPlannedNextDay || ""}
                onChange={(e) =>
                  handleInputChange("workPlannedNextDay", e.target.value)
                }
                placeholder="Work planned for tomorrow..."
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Issues Encountered
              </label>
              <textarea
                rows={3}
                value={formData.issues || ""}
                onChange={(e) => handleInputChange("issues", e.target.value)}
                placeholder="Any issues, problems, or delays encountered..."
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Scores */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="mb-4 text-lg font-medium text-gray-900">
            Performance Scores
          </h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Safety Score (1-10) *
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.safetyScore}
                onChange={(e) =>
                  handleInputChange("safetyScore", parseInt(e.target.value))
                }
                className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                  errors.safetyScore ? "border-red-300" : ""
                }`}
                required
              />
              {errors.safetyScore && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.safetyScore}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Quality Score (1-10) *
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.qualityScore}
                onChange={(e) =>
                  handleInputChange("qualityScore", parseInt(e.target.value))
                }
                className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                  errors.qualityScore ? "border-red-300" : ""
                }`}
                required
              />
              {errors.qualityScore && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.qualityScore}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Tasks Completed */}
        <div className="border-t border-gray-200 pt-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              Tasks Completed
            </h3>
            <button
              type="button"
              onClick={addTask}
              className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-3 py-1 text-sm font-medium text-white hover:bg-blue-700"
            >
              Add Task
            </button>
          </div>

          {formData.tasksCompleted?.map((task, index) => (
            <div
              key={index}
              className="mb-4 rounded-lg border border-gray-200 p-4"
            >
              <div className="mb-3 flex items-start justify-between">
                <h4 className="text-sm font-medium text-gray-900">
                  Task {index + 1}
                </h4>
                <button
                  type="button"
                  onClick={() => removeTask(index)}
                  className="text-red-600 hover:text-red-900"
                >
                  Remove
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Task Title
                  </label>
                  <input
                    type="text"
                    value={task.title}
                    onChange={(e) =>
                      handleTaskChange(index, "title", e.target.value)
                    }
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Completion %
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={task.completionPercentage}
                    onChange={(e) =>
                      handleTaskChange(
                        index,
                        "completionPercentage",
                        parseInt(e.target.value)
                      )
                    }
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Materials Used */}
        <div className="border-t border-gray-200 pt-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              Materials Used
            </h3>
            <button
              type="button"
              onClick={addMaterial}
              className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-3 py-1 text-sm font-medium text-white hover:bg-blue-700"
            >
              Add Material
            </button>
          </div>

          {formData.materialsUsed?.map((material, index) => (
            <div
              key={index}
              className="mb-4 rounded-lg border border-gray-200 p-4"
            >
              <div className="mb-3 flex items-start justify-between">
                <h4 className="text-sm font-medium text-gray-900">
                  Material {index + 1}
                </h4>
                <button
                  type="button"
                  onClick={() => removeMaterial(index)}
                  className="text-red-600 hover:text-red-900"
                >
                  Remove
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Material Name
                  </label>
                  <input
                    type="text"
                    value={material.name}
                    onChange={(e) =>
                      handleMaterialChange(index, "name", e.target.value)
                    }
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={material.quantity}
                    onChange={(e) =>
                      handleMaterialChange(
                        index,
                        "quantity",
                        parseFloat(e.target.value)
                      )
                    }
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Unit
                  </label>
                  <input
                    type="text"
                    value={material.unit}
                    onChange={(e) =>
                      handleMaterialChange(index, "unit", e.target.value)
                    }
                    placeholder="e.g., pieces, feet, lbs"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Unit Cost ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={material.unitCost || 0}
                    onChange={(e) =>
                      handleMaterialChange(
                        index,
                        "unitCost",
                        parseFloat(e.target.value)
                      )
                    }
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Notes */}
        <div className="border-t border-gray-200 pt-6">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Additional Notes
            </label>
            <textarea
              rows={3}
              value={formData.additionalNotes || ""}
              onChange={(e) =>
                handleInputChange("additionalNotes", e.target.value)
              }
              placeholder="Any additional notes or observations..."
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Validation Results */}
        {validation && (
          <div className="border-t border-gray-200 pt-6">
            <h3 className="mb-4 text-lg font-medium text-gray-900">
              Validation Results
            </h3>

            {validation.warnings.length > 0 && (
              <div className="mb-4 border-l-4 border-yellow-400 bg-yellow-50 p-4">
                <h4 className="text-sm font-medium text-yellow-800">
                  Warnings:
                </h4>
                <ul className="mt-2 list-inside list-disc text-sm text-yellow-700">
                  {validation.warnings.map((warning: any, index: number) => (
                    <li key={index}>{warning.message}</li>
                  ))}
                </ul>
              </div>
            )}

            {validation.suggestions.length > 0 && (
              <div className="mb-4 border-l-4 border-blue-400 bg-blue-50 p-4">
                <h4 className="text-sm font-medium text-blue-800">
                  Suggestions:
                </h4>
                <ul className="mt-2 list-inside list-disc text-sm text-blue-700">
                  {validation.suggestions.map(
                    (suggestion: string, index: number) => (
                      <li key={index}>{suggestion}</li>
                    )
                  )}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4 border-t border-gray-200 pt-6">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting
              ? "Saving..."
              : reportId
                ? "Update Report"
                : "Create Report"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DailyReportForm;
