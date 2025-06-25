import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth, useRole } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: number;
  requireAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  requireAuth = true,
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { hasRole } = useRole();
  const location = useLocation();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Check authentication requirement
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role requirement
  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page.
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

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
export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <ProtectedRoute requiredRole={1}>{children}</ProtectedRoute>;

export const ManagerRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <ProtectedRoute requiredRole={2}>{children}</ProtectedRoute>;

export const UserRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <ProtectedRoute requiredRole={3}>{children}</ProtectedRoute>;

export const ViewerRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <ProtectedRoute requiredRole={4}>{children}</ProtectedRoute>;

export default ProtectedRoute;
