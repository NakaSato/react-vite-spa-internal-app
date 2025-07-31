import React, { useState } from "react";
import { useRole } from "../shared/hooks";
import { SimpleReportsService } from "../shared/utils/simpleReportsService";

interface SimpleReportsProps {
  onGenerateReport?: (
    reportType: string,
    dateRange: { start: string; end: string }
  ) => void;
}

const SimpleReports: React.FC<SimpleReportsProps> = ({ onGenerateReport }) => {
  const { isAdmin, isManager } = useRole();
  const [dateRange, setDateRange] = useState({
    start: "",
    end: "",
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const reportTypes = [
    {
      id: "daily-summary",
      title: "Daily Summary",
      description: "Overview of daily reports and productivity",
      icon: "📊",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      iconColor: "text-blue-600",
    },
    {
      id: "weekly-progress",
      title: "Weekly Progress",
      description: "Weekly team performance and milestones",
      icon: "📈",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      iconColor: "text-green-600",
    },
    {
      id: "safety-quality",
      title: "Safety & Quality",
      description: "Safety scores and quality metrics analysis",
      icon: "🛡️",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      iconColor: "text-yellow-600",
    },
    {
      id: "weather-impact",
      title: "Weather Impact",
      description: "Weather conditions effect on productivity",
      icon: "🌤️",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200",
      iconColor: "text-indigo-600",
    },
  ];

  const handleGenerateReport = async (reportType: string) => {
    if (!dateRange.start || !dateRange.end) {
      alert("Please select both start and end dates for the report.");
      return;
    }

    if (new Date(dateRange.start) > new Date(dateRange.end)) {
      alert("Start date must be before end date.");
      return;
    }

    setIsGenerating(true);
    try {
      // Simulate report generation delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Generate sample data and download report
      const reportData = SimpleReportsService.generateSampleData(
        reportType,
        dateRange
      );

      // Ask user for format preference
      const format = confirm(
        "Choose report format:\nOK = Text (.txt)\nCancel = CSV (.csv)"
      );

      if (format) {
        SimpleReportsService.downloadTextReport(reportData);
      } else {
        SimpleReportsService.downloadCSVReport(reportData);
      }

      if (onGenerateReport) {
        onGenerateReport(reportType, dateRange);
      }

      // Show success message
      const reportTitle =
        reportTypes.find((r) => r.id === reportType)?.title || "Report";
      alert(`${reportTitle} generated successfully and downloaded!`);
    } catch (error) {
      console.error("Failed to generate report:", error);
      alert("Failed to generate report. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const getQuickDateRange = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);

    setDateRange({
      start: start.toISOString().split("T")[0],
      end: end.toISOString().split("T")[0],
    });
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              📄 Simple Reports
            </h3>
            <p className="mt-1 text-gray-600">
              Generate quick reports for your daily work activities
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
              {isAdmin ? "Admin" : isManager ? "Manager" : "User"} Access
            </span>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Date Range Selection */}
        <div className="mb-6">
          <h4 className="mb-4 text-lg font-medium text-gray-900">
            📅 Select Date Range
          </h4>

          {/* Quick Date Buttons */}
          <div className="mb-4 flex flex-wrap gap-2">
            <button
              onClick={() => getQuickDateRange(7)}
              className="rounded-md bg-gray-100 px-3 py-1 text-sm text-gray-700 transition-colors hover:bg-gray-200"
            >
              Last 7 Days
            </button>
            <button
              onClick={() => getQuickDateRange(30)}
              className="rounded-md bg-gray-100 px-3 py-1 text-sm text-gray-700 transition-colors hover:bg-gray-200"
            >
              Last 30 Days
            </button>
            <button
              onClick={() => getQuickDateRange(90)}
              className="rounded-md bg-gray-100 px-3 py-1 text-sm text-gray-700 transition-colors hover:bg-gray-200"
            >
              Last 3 Months
            </button>
          </div>

          {/* Custom Date Range */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, start: e.target.value }))
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, end: e.target.value }))
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Report Types Grid */}
        <div className="mb-6">
          <h4 className="mb-4 text-lg font-medium text-gray-900">
            📋 Available Reports
          </h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {reportTypes.map((report) => (
              <div
                key={report.id}
                className={`${report.bgColor} ${report.borderColor} rounded-lg border p-4 transition-shadow hover:shadow-md`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`text-2xl ${report.iconColor}`}>
                      {report.icon}
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900">
                        {report.title}
                      </h5>
                      <p className="mt-1 text-sm text-gray-600">
                        {report.description}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleGenerateReport(report.id)}
                    disabled={
                      isGenerating || !dateRange.start || !dateRange.end
                    }
                    className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                      isGenerating || !dateRange.start || !dateRange.end
                        ? "cursor-not-allowed bg-gray-100 text-gray-400"
                        : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {isGenerating ? (
                      <div className="flex items-center space-x-1">
                        <div className="h-3 w-3 animate-spin rounded-full border border-gray-400 border-t-transparent"></div>
                        <span>Generating...</span>
                      </div>
                    ) : (
                      "Generate"
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="border-t border-gray-200 pt-6">
          <h4 className="mb-4 text-lg font-medium text-gray-900">
            ⚡ Quick Actions
          </h4>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                // Generate all reports
                if (dateRange.start && dateRange.end) {
                  reportTypes.forEach((report) => {
                    setTimeout(
                      () => handleGenerateReport(report.id),
                      Math.random() * 1000
                    );
                  });
                } else {
                  alert("Please select a date range first.");
                }
              }}
              disabled={isGenerating || !dateRange.start || !dateRange.end}
              className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Generate All Reports
            </button>

            {(isAdmin || isManager) && (
              <button
                onClick={() => {
                  const email = prompt("Enter email address to send reports:");
                  if (email) {
                    alert(
                      `Reports will be emailed to ${email} (feature coming soon)`
                    );
                  }
                }}
                className="inline-flex items-center rounded-lg bg-green-600 px-4 py-2 font-medium text-white transition-colors hover:bg-green-700"
              >
                <svg
                  className="mr-2 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Email Reports
              </button>
            )}

            <button
              onClick={() => {
                alert("Report scheduling feature coming soon!");
              }}
              className="inline-flex items-center rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-200"
            >
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Schedule Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleReports;
