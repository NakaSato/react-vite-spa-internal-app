import { Navigate, useLocation } from "react-router-dom";
import { useAuth, useRole } from "../../shared/hooks/useAuth";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: number;
  requireAuth?: boolean;
  redirectToIndex?: boolean; // New prop to control redirect behavior
}

export default function ProtectedRoute({
  children,
  requiredRole,
  requireAuth = true,
  redirectToIndex = false,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { hasRole } = useRole();
  const location = useLocation();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Check authentication requirement
  if (requireAuth && !isAuthenticated) {
    // If redirectToIndex is true, redirect to index page instead of login
    if (redirectToIndex) {
      return <Navigate to="/" replace />;
    }
    // Default behavior: redirect to login with return path
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Additional session validation - check if user object exists and has valid data
  if (requireAuth && isAuthenticated && (!user || !user.userId)) {
    // Session appears invalid, redirect to index
    return <Navigate to="/" replace />;
  }

  // Check role requirement
  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-8 w-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="mb-4 text-2xl font-bold text-gray-900">
            Access Denied
          </h1>
          <p className="mx-auto mb-6 max-w-md text-gray-600">
            You don't have the required permissions to access this page.
            {user?.roleName && (
              <span className="mt-2 block text-sm">
                Your current role:{" "}
                <span className="font-medium">{user.roleName}</span>
              </span>
            )}
          </p>
          <div className="space-y-2 sm:flex sm:justify-center sm:space-x-4 sm:space-y-0">
            <button
              onClick={() => window.history.back()}
              className="inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
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
            <button
              onClick={() => (window.location.href = "/dashboard")}
              className="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// Higher-order component for role-based access
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
  requiredRole?: number
) => {
  return (props: P) => (
    <ProtectedRoute requiredRole={requiredRole}>
      <Component {...props} />
    </ProtectedRoute>
  );
};

// Role-specific route components
export function AdminRoute({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute requiredRole={1}>{children}</ProtectedRoute>;
}

export function ManagerRoute({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute requiredRole={2}>{children}</ProtectedRoute>;
}

export function UserRoute({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute requiredRole={3}>{children}</ProtectedRoute>;
}

export function ViewerRoute({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute requiredRole={4}>{children}</ProtectedRoute>;
}
