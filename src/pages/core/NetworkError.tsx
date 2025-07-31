import { useNavigate } from "react-router-dom";
import { useAuth } from "../../shared/hooks/useAuth";

interface NetworkErrorProps {
  message?: string;
  onRetry?: () => void;
  isOffline?: boolean;
}

export default function NetworkError({
  message = "Network Connection Error",
  onRetry,
  isOffline = false,
}: NetworkErrorProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleGoHome = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          {/* Network Error Icon */}
          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-orange-100">
            <svg
              className="h-12 w-12 text-orange-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
              />
            </svg>
          </div>

          {/* Error Text */}
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            {isOffline ? "You're Offline" : "Connection Problem"}
          </h1>
          <h2 className="mb-4 text-xl font-semibold text-gray-700">
            {isOffline ? "No Internet Connection" : "Network Error"}
          </h2>
          <p className="mx-auto mb-8 max-w-md text-gray-600">
            {isOffline
              ? "Please check your internet connection and try again."
              : message ||
                "Unable to connect to our servers. Please check your connection and try again."}
          </p>

          {/* Network Status */}
          <div className="mx-auto mb-8 max-w-sm rounded-lg border border-orange-200 bg-orange-50 p-4 text-left">
            <h3 className="mb-2 text-sm font-medium text-orange-800">
              Connection Status
            </h3>
            <div className="space-y-2 text-sm text-orange-700">
              <div className="flex items-center justify-between">
                <span>Internet:</span>
                <span
                  className={`font-medium ${
                    navigator.onLine ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {navigator.onLine ? "✓ Connected" : "✗ Disconnected"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Server:</span>
                <span className="font-medium text-orange-600">
                  ⚠ Checking...
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 sm:flex sm:justify-center sm:space-x-4 sm:space-y-0">
            <button
              onClick={handleRetry}
              className="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-6 py-3 text-base font-medium text-white transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
            >
              <svg
                className="mr-2 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Retry Connection
            </button>

            <button
              onClick={handleGoHome}
              className="inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
            >
              <svg
                className="mr-2 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              {isAuthenticated ? "Go to Dashboard" : "Go to Home"}
            </button>
          </div>

          {/* Troubleshooting Tips */}
          <div className="mt-8 border-t border-gray-200 pt-8">
            <p className="mb-4 text-sm text-gray-500">Troubleshooting tips:</p>
            <div className="space-y-1 text-xs text-gray-400">
              <p>• Check your internet connection</p>
              <p>• Try refreshing the page</p>
              <p>• Disable VPN if active</p>
              <p>• Contact IT support if problem persists</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
