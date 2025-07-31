import React, { useState } from "react";
import { EnhancedError } from "@utils/errorHandler";

interface ErrorReportProps {
  error: EnhancedError;
  onRetry?: () => void;
  onDismiss?: () => void;
  showDetails?: boolean;
}

const ErrorReport: React.FC<ErrorReportProps> = ({
  error,
  onRetry,
  onDismiss,
  showDetails = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(showDetails);

  const getSeverityColor = (severity: EnhancedError["severity"]) => {
    switch (severity) {
      case "critical":
        return "bg-red-50 border-red-200 text-red-800";
      case "high":
        return "bg-orange-50 border-orange-200 text-orange-800";
      case "medium":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "low":
        return "bg-blue-50 border-blue-200 text-blue-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  const getTypeIcon = (type: EnhancedError["type"]) => {
    switch (type) {
      case "network":
        return "🌐";
      case "api":
        return "🔌";
      case "auth":
        return "🔐";
      case "validation":
        return "📝";
      case "runtime":
        return "⚙️";
      default:
        return "❗";
    }
  };

  return (
    <div
      className={`rounded-lg border-2 p-4 ${getSeverityColor(error.severity)}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <span className="text-2xl">{getTypeIcon(error.type)}</span>
          <div>
            <h3 className="text-lg font-semibold">{error.userMessage}</h3>
            <p className="mt-1 text-sm opacity-75">
              Error Type:{" "}
              {error.type.charAt(0).toUpperCase() + error.type.slice(1)}•
              Severity:{" "}
              {error.severity.charAt(0).toUpperCase() + error.severity.slice(1)}
              {error.isRetryable && " • Retryable"}
            </p>
          </div>
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-xl leading-none text-gray-500 hover:text-gray-700"
            aria-label="Dismiss error"
          >
            ×
          </button>
        )}
      </div>

      {/* Suggestions */}
      {error.suggestions.length > 0 && (
        <div className="mt-4">
          <h4 className="mb-2 font-medium">What you can try:</h4>
          <ul className="space-y-1">
            {error.suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="mt-0.5 text-green-600">•</span>
                <span className="text-sm">{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-4 flex flex-wrap gap-2">
        {error.isRetryable && onRetry && (
          <button
            onClick={onRetry}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Try Again
          </button>
        )}

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
        >
          {isExpanded ? "Hide Details" : "Show Details"}
        </button>

        {error.context?.component && (
          <button
            onClick={() => window.location.reload()}
            className="rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
          >
            Refresh Page
          </button>
        )}
      </div>

      {/* Technical Details (Collapsible) */}
      {isExpanded && (
        <div className="mt-4 rounded border bg-white bg-opacity-50 p-3">
          <h4 className="mb-2 font-medium">Technical Details:</h4>
          <div className="space-y-2 font-mono text-sm">
            <div>
              <strong>Error ID:</strong> {error.id}
            </div>
            <div>
              <strong>Timestamp:</strong>{" "}
              {new Date(error.timestamp).toLocaleString()}
            </div>
            {error.context?.component && (
              <div>
                <strong>Component:</strong> {error.context.component}
              </div>
            )}
            {error.context?.action && (
              <div>
                <strong>Action:</strong> {error.context.action}
              </div>
            )}
            {error.context?.projectId && (
              <div>
                <strong>Project ID:</strong> {error.context.projectId}
              </div>
            )}
            <div>
              <strong>Technical Message:</strong>
              <pre className="mt-1 overflow-x-auto whitespace-pre-wrap rounded bg-gray-100 p-2 text-xs">
                {error.message}
              </pre>
            </div>
            {error.context?.url && (
              <div>
                <strong>URL:</strong> {error.context.url}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ErrorReport;
