import React, { useState } from "react";
import { CreateDailyReportRequest } from "../shared/types/reports";

interface QuickReportFormProps {
  projectId: string;
  onSubmit: (data: CreateDailyReportRequest) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function QuickReportForm({
  projectId,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: QuickReportFormProps) {
  const [formData, setFormData] = useState<CreateDailyReportRequest>({
    projectId,
    reportDate: new Date().toISOString().split("T")[0],
    generalNotes: "",
    weatherCondition: "Sunny",
    temperature: 72,
    humidity: 50,
    workSummary: "",
    workAccomplished: "",
    workPlannedNextDay: "",
    issuesEncountered: "",
    totalWorkHours: 8,
    personnelOnSite: 1,
    safetyScore: 10,
    qualityScore: 10,
    dailyProgressContribution: 0,
    additionalNotes: "",
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const handleInputChange = (
    field: keyof CreateDailyReportRequest,
    value: any
  ) => {
    setFormData((prev: CreateDailyReportRequest) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const renderProgressBar = () => (
    <div className="mb-6">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-sm text-gray-500">
          {Math.round((currentStep / totalSteps) * 100)}% Complete
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-200">
        <div
          className="h-2 rounded-full bg-blue-600 transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        📅 Basic Information
      </h3>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Report Date
        </label>
        <input
          type="date"
          value={formData.reportDate}
          onChange={(e) => handleInputChange("reportDate", e.target.value)}
          className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Work Hours
        </label>
        <input
          type="number"
          min="0"
          max="24"
          step="0.5"
          value={formData.totalWorkHours}
          onChange={(e) =>
            handleInputChange("totalWorkHours", Number(e.target.value))
          }
          className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Personnel on Site
        </label>
        <input
          type="number"
          min="1"
          value={formData.personnelOnSite}
          onChange={(e) =>
            handleInputChange("personnelOnSite", Number(e.target.value))
          }
          className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        🌤️ Weather & Conditions
      </h3>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Weather Condition
        </label>
        <select
          value={formData.weatherCondition || "Sunny"}
          onChange={(e) =>
            handleInputChange("weatherCondition", e.target.value)
          }
          className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
        >
          <option value="Sunny">☀️ Sunny</option>
          <option value="PartlyCloudy">⛅ Partly Cloudy</option>
          <option value="Cloudy">☁️ Cloudy</option>
          <option value="Rainy">🌧️ Rainy</option>
          <option value="Stormy">⛈️ Stormy</option>
          <option value="Foggy">🌫️ Foggy</option>
          <option value="Snow">❄️ Snow</option>
          <option value="Windy">💨 Windy</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Temperature (°F)
          </label>
          <input
            type="number"
            value={formData.temperature || ""}
            onChange={(e) =>
              handleInputChange("temperature", Number(e.target.value))
            }
            className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Humidity (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={formData.humidity || ""}
            onChange={(e) =>
              handleInputChange("humidity", Number(e.target.value))
            }
            className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        📝 Work Summary
      </h3>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Work Summary
        </label>
        <textarea
          rows={4}
          value={formData.workSummary}
          onChange={(e) => handleInputChange("workSummary", e.target.value)}
          placeholder="Brief overview of today's work..."
          className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Work Accomplished
        </label>
        <textarea
          rows={3}
          value={formData.workAccomplished || ""}
          onChange={(e) =>
            handleInputChange("workAccomplished", e.target.value)
          }
          placeholder="What was completed today..."
          className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Work Planned for Tomorrow
        </label>
        <textarea
          rows={3}
          value={formData.workPlannedNextDay || ""}
          onChange={(e) =>
            handleInputChange("workPlannedNextDay", e.target.value)
          }
          placeholder="What's planned for tomorrow..."
          className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        📊 Scores & Final Notes
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Safety Score (1-10)
          </label>
          <div className="relative">
            <input
              type="range"
              min="1"
              max="10"
              value={formData.safetyScore}
              onChange={(e) =>
                handleInputChange("safetyScore", Number(e.target.value))
              }
              className="slider h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
            />
            <div className="mt-1 flex justify-between text-xs text-gray-500">
              <span>1</span>
              <span className="font-semibold text-green-600">
                {formData.safetyScore}
              </span>
              <span>10</span>
            </div>
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Quality Score (1-10)
          </label>
          <div className="relative">
            <input
              type="range"
              min="1"
              max="10"
              value={formData.qualityScore}
              onChange={(e) =>
                handleInputChange("qualityScore", Number(e.target.value))
              }
              className="slider h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
            />
            <div className="mt-1 flex justify-between text-xs text-gray-500">
              <span>1</span>
              <span className="font-semibold text-blue-600">
                {formData.qualityScore}
              </span>
              <span>10</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Daily Progress Contribution (%)
        </label>
        <div className="relative">
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={formData.dailyProgressContribution}
            onChange={(e) =>
              handleInputChange(
                "dailyProgressContribution",
                Number(e.target.value)
              )
            }
            className="slider h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
          />
          <div className="mt-1 flex justify-between text-xs text-gray-500">
            <span>0%</span>
            <span className="font-semibold text-purple-600">
              {formData.dailyProgressContribution}%
            </span>
            <span>100%</span>
          </div>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Issues Encountered
        </label>
        <textarea
          rows={3}
          value={formData.issuesEncountered || ""}
          onChange={(e) =>
            handleInputChange("issuesEncountered", e.target.value)
          }
          placeholder="Any issues or challenges faced today..."
          className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Additional Notes
        </label>
        <textarea
          rows={3}
          value={formData.additionalNotes || ""}
          onChange={(e) => handleInputChange("additionalNotes", e.target.value)}
          placeholder="Any additional notes or observations..."
          className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return renderStep1();
    }
  };

  return (
    <div className="mx-auto max-w-lg rounded-lg bg-white shadow-xl">
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-xl font-bold text-gray-900">
          📝 Quick Daily Report
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Create a report in 4 easy steps
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        {renderProgressBar()}
        {renderStepContent()}

        <div className="mt-8 flex justify-between border-t border-gray-200 pt-6">
          <div>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrevious}
                className="px-4 py-2 font-medium text-gray-600 hover:text-gray-800"
              >
                ← Previous
              </button>
            )}
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 font-medium text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={handleNext}
                className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700"
              >
                Next →
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className={`rounded-lg px-6 py-2 font-medium ${
                  isSubmitting
                    ? "cursor-not-allowed bg-gray-400 text-gray-200"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                    Submitting...
                  </>
                ) : (
                  "✅ Submit Report"
                )}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
