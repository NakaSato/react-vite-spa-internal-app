import { Route, Routes, useLocation } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import Footer from "../components/layout/Footer";
import { About, Home, Login, NotFound, ProjectDebug, Register } from "../pages";
import { DashboardProvider } from "../shared/contexts";
import { useAuth } from "../shared/hooks/useAuth";
import { Navigation } from "../widgets";
import {
  DailyReportsLazy,
  DashboardLazy,
  ProjectDetailLazy,
  ProjectDetailRefactoredLazy,
  ProjectScheduleLazy,
  RealTimeProjectDashboardLazy,
} from "./LazyPages";

function AppRoutesContent() {
  const { isLoading } = useAuth();
  const location = useLocation();

  // Check if we're on the index page
  const isIndexPage = location.pathname === "/";

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App flex min-h-screen flex-col bg-gray-50">
      {!isIndexPage && <Navigation />}
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute redirectToIndex={true}>
                <DashboardLazy />
              </ProtectedRoute>
            }
          />

          {/* Real-time Project Management Dashboard */}
          <Route
            path="/projects/realtime"
            element={
              <ProtectedRoute redirectToIndex={true}>
                <RealTimeProjectDashboardLazy />
              </ProtectedRoute>
            }
          />

          {/* Project Detail Page */}
          <Route
            path="/projects/:projectId"
            element={
              <ProtectedRoute redirectToIndex={true}>
                <ProjectDetailLazy />
              </ProtectedRoute>
            }
          />

          {/* Refactored Project Detail Page (for testing) */}
          <Route
            path="/projects/:projectId/refactored"
            element={
              <ProtectedRoute redirectToIndex={true}>
                <ProjectDetailRefactoredLazy />
              </ProtectedRoute>
            }
          />

          {/* Project Debug Page */}
          <Route
            path="/debug/projects"
            element={
              <ProtectedRoute redirectToIndex={true}>
                <ProjectDebug />
              </ProtectedRoute>
            }
          />

          {/* Project Schedule Management Page */}
          <Route
            path="/projects/:projectId/schedule"
            element={
              <ProtectedRoute redirectToIndex={true}>
                <ProjectScheduleLazy />
              </ProtectedRoute>
            }
          />

          {/* Daily Reports Management */}
          <Route
            path="/daily-reports"
            element={
              <ProtectedRoute redirectToIndex={true}>
                <DailyReportsLazy />
              </ProtectedRoute>
            }
          />
          {/* 404 Not Found - This will catch all unmatched routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isIndexPage && <Footer />}
    </div>
  );
}

function AppRoutes() {
  return (
    <DashboardProvider>
      <AppRoutesContent />
    </DashboardProvider>
  );
}

export default AppRoutes;
