import {
  ArrowBack as ArrowBackIcon,
  Dashboard as DashboardIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import {
  alpha,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import React, { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth, useRole } from "../../shared/hooks/useAuth";

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
  const theme = useTheme();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          bgcolor: "background.default",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress size={48} thickness={4} sx={{ mb: 2 }} />
          <Typography
            variant="body1"
            sx={{
              fontFamily: "Sarabun, sans-serif",
              color: "text.secondary",
            }}
          >
            Loading...
          </Typography>
        </Box>
      </Box>
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
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          bgcolor: "background.default",
          p: 2,
        }}
      >
        <Container maxWidth="sm">
          <Box
            sx={{
              textAlign: "center",
              bgcolor: "background.paper",
              borderRadius: 3,
              p: 4,
              boxShadow: theme.shadows[4],
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            <Avatar
              sx={{
                bgcolor: alpha(theme.palette.error.main, 0.1),
                color: "error.main",
                width: 64,
                height: 64,
                mx: "auto",
                mb: 3,
              }}
            >
              <WarningIcon sx={{ fontSize: 32 }} />
            </Avatar>

            <Typography
              variant="h4"
              sx={{
                fontFamily: "Sarabun, sans-serif",
                fontWeight: 700,
                color: "text.primary",
                mb: 2,
              }}
            >
              Access Denied
            </Typography>

            <Typography
              variant="body1"
              sx={{
                fontFamily: "Sarabun, sans-serif",
                color: "text.secondary",
                mb: 3,
                maxWidth: 400,
                mx: "auto",
              }}
            >
              You don't have the required permissions to access this page.
            </Typography>

            {user?.roleName && (
              <Chip
                label={`Current role: ${user.roleName}`}
                variant="outlined"
                color="secondary"
                sx={{
                  fontFamily: "Sarabun, sans-serif",
                  mb: 3,
                }}
              />
            )}

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="center"
              sx={{ mt: 4 }}
            >
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => window.history.back()}
                sx={{
                  fontFamily: "Sarabun, sans-serif",
                  fontWeight: 500,
                  textTransform: "none",
                }}
              >
                Go Back
              </Button>
              <Button
                variant="contained"
                startIcon={<DashboardIcon />}
                onClick={() => (window.location.href = "/dashboard")}
                sx={{
                  fontFamily: "Sarabun, sans-serif",
                  fontWeight: 500,
                  textTransform: "none",
                }}
              >
                Go to Dashboard
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>
    );
  }

  return <>{children}</>;
}

// Higher-order component for role-based access
export const withAuth = <P extends {}>(
  Component: React.ComponentType<P>,
  requiredRole?: number
) => {
  const AuthenticatedComponent = (props: P) => (
    <ProtectedRoute requiredRole={requiredRole}>
      <Component {...(props as any)} />
    </ProtectedRoute>
  );

  // Set display name for debugging
  AuthenticatedComponent.displayName = `withAuth(${Component.displayName || Component.name || "Component"})`;

  return AuthenticatedComponent;
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
