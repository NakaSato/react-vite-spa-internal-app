import { useNavigate } from "react-router-dom";
import { useAuth } from "../../shared/hooks/useAuth";

interface ForbiddenProps {
  message?: string;
  requiredRole?: string;
  currentRole?: string;
}

export default function Forbidden({
  message = "Access Denied",
  requiredRole,
  currentRole,
}: ForbiddenProps) {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const handleGoHome = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          {/* 403 Icon */}
          <div className="mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-yellow-100 mb-8">
            <svg
              className="h-12 w-12 text-yellow-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 0h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>

          {/* Error Text */}
          <h1 className="text-6xl font-bold text-gray-900 mb-4">403</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Access Forbidden
          </h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {message}. You don't have permission to access this resource.
          </p>

          {/* Role Information */}
          {(requiredRole || currentRole || user) && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8 text-left max-w-sm mx-auto">
              <h3 className="text-sm font-medium text-yellow-800 mb-2">
                Access Information
              </h3>
              {currentRole && (
                <p className="text-sm text-yellow-700 mb-1">
                  <span className="font-medium">Your Role:</span> {currentRole}
                </p>
              )}
              {user && (
                <p className="text-sm text-yellow-700 mb-1">
                  <span className="font-medium">Your Role:</span>{" "}
                  {user.roleName || "Unknown"}
                </p>
              )}
              {requiredRole && (
                <p className="text-sm text-yellow-700 mb-1">
                  <span className="font-medium">Required:</span> {requiredRole}
                </p>
              )}
              <p className="text-sm text-yellow-700">
                Contact your administrator to request access.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <button
              onClick={handleGoHome}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <svg
                className="w-5 h-5 mr-2"
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
              onClick={handleGoBack}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <svg
                className="w-5 h-5 mr-2"
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

          {/* Contact Information */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-2">
              Need access to this resource?
            </p>
            <div className="space-y-1">
              <p className="text-sm text-gray-400">
                Contact your system administrator
              </p>
              <p className="text-sm text-gray-400">
                or submit a support request
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
