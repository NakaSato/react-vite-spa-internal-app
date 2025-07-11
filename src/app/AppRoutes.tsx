import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../shared/hooks/useAuth";
import { DashboardProvider } from "../shared/contexts";
import {
  Home,
  About,
  Login,
  Dashboard,
  Register,
  DailyReports,
  NotFound,
  ProjectDetail,
  ApiDebugTest,
  TestIntegrationPage,
} from "../pages";
import { Navigation, RealTimeNotifications } from "../widgets";
import { RealTimeProjectDashboard } from "../features/projects";
import Footer from "../components/Footer";
import ProtectedRoute from "../features/auth/ProtectedRoute";

const AppRoutesContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Check if we're on the index page
  const isIndexPage = location.pathname === "/";

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App min-h-screen bg-gray-50 flex flex-col">
      {!isIndexPage && <Navigation />}
      <main className="flex-grow">
        {/* Real-time notifications for authenticated users */}
        {/* TEMPORARILY DISABLED: RealTimeNotifications until backend endpoint is implemented */}
        {/* {isAuthenticated && <RealTimeNotifications position="top-right" />} */}

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
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Real-time Project Management Dashboard */}
          <Route
            path="/projects/realtime"
            element={
              <ProtectedRoute redirectToIndex={true}>
                <RealTimeProjectDashboard />
              </ProtectedRoute>
            }
          />

          {/* Project Detail Page */}
          <Route
            path="/projects/:projectId"
            element={
              <ProtectedRoute redirectToIndex={true}>
                <ProjectDetail />
              </ProtectedRoute>
            }
          />

          {/* Daily Reports Management */}
          <Route
            path="/daily-reports"
            element={
              <ProtectedRoute redirectToIndex={true}>
                <DailyReports />
              </ProtectedRoute>
            }
          />

          {/* API Debug Test - Development Only */}
          <Route
            path="/api-debug"
            element={
              <ProtectedRoute redirectToIndex={true}>
                <ApiDebugTest />
              </ProtectedRoute>
            }
          />

          {/* Integration Test Dashboard - Development Only */}
          <Route
            path="/integration-test"
            element={
              <ProtectedRoute redirectToIndex={true}>
                <TestIntegrationPage />
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
};

const AppRoutes: React.FC = () => {
  return (
    <DashboardProvider>
      <AppRoutesContent />
    </DashboardProvider>
  );
};

export default AppRoutes;
