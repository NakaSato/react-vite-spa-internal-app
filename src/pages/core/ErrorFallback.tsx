import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../shared/hooks/useAuth";

interface ErrorFallbackProps {
  error?: Error | string;
  resetError?: () => void;
  children?: ReactNode;
}

export default function ErrorFallback({
  error,
  resetError,
  children,
}: ErrorFallbackProps) {
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
    if (resetError) {
      resetError();
    } else {
      window.location.reload();
    }
  };

  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : undefined;

  return (
    <div className="flex min-h-screen flex-col justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="text-center">
          {/* Error Icon */}
          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-12 w-12 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          {/* Error Text */}
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            Something went wrong
          </h1>
          <h2 className="mb-4 text-xl font-semibold text-gray-700">
            Application Error
          </h2>
          <p className="mx-auto mb-8 max-w-md text-gray-600">
            An unexpected error occurred. We apologize for the inconvenience and
            our team has been notified.
          </p>

          {/* Error Details (Development Mode) */}
          {import.meta.env.DEV && error && (
            <div className="mx-auto mb-8 max-w-4xl rounded-lg border border-red-200 bg-red-50 p-6 text-left">
              <h3 className="mb-3 text-lg font-semibold text-red-900">
                Error Details (Development Mode)
              </h3>
              <div className="mb-4 rounded-md bg-red-100 p-4">
                <h4 className="mb-2 font-medium text-red-800">Message:</h4>
                <p className="break-all font-mono text-sm text-red-700">
                  {errorMessage}
                </p>
              </div>
              {errorStack && (
                <div className="rounded-md bg-red-100 p-4">
                  <h4 className="mb-2 font-medium text-red-800">
                    Stack Trace:
                  </h4>
                  <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-xs text-red-700">
                    {errorStack}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* Custom Error Content */}
          {children && (
            <div className="mx-auto mb-8 max-w-4xl rounded-lg border border-gray-200 bg-gray-50 p-6">
              {children}
            </div>
          )}

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
              Try Again
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

            <button
              onClick={() => navigate(-1)}
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
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Go Back
            </button>
          </div>

          {/* Support Information */}
          <div className="mt-8 border-t border-gray-200 pt-8">
            <p className="mb-4 text-sm text-gray-500">
              If this problem persists, please contact our support team.
            </p>
            <div className="space-y-1">
              <p className="text-xs text-gray-400">
                Error ID: ERR-{Date.now()}-
                {Math.random().toString(36).substr(2, 9)}
              </p>
              <p className="text-xs text-gray-400">
                Time: {new Date().toLocaleString()}
              </p>
              <p className="text-xs text-gray-400">
                User Agent: {navigator.userAgent.slice(0, 100)}...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
