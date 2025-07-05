import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../shared/hooks/useAuth";
import { DashboardProvider, useDashboard } from "../shared/contexts";
import { Home, About, Login, Dashboard, Register, NotFound } from "../pages";
import { Navigation } from "../widgets";
import Footer from "../components/Footer";
import ProtectedRoute from "../features/auth/ProtectedRoute";

const AppRoutesContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const { activeTab, setActiveTab } = useDashboard();

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
      {!isIndexPage && (
        <Navigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          showTabs={location.pathname === "/dashboard"}
        />
      )}
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
                <Dashboard />
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
