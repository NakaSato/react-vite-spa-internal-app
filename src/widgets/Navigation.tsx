import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../shared/hooks/useAuth";
import { LogoutButton } from "../features/auth";

const Navigation: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  return (
    <>
      <nav className="bg-blue-600 text-white p-4 shadow-lg">
        <div className="w-full max-w-none px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-xl font-bold hover:text-blue-200">
                INTERNAL CONSTRUCTION
              </Link>

              {/* Navigation Links */}
              {isAuthenticated && (
                <div className="hidden md:flex items-center space-x-4 ml-8">
                  <Link
                    to="/dashboard"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === "/dashboard"
                        ? "bg-blue-700 text-white"
                        : "text-blue-100 hover:text-white hover:bg-blue-700"
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/projects/realtime"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === "/projects/realtime"
                        ? "bg-blue-700 text-white"
                        : "text-blue-100 hover:text-white hover:bg-blue-700"
                    }`}
                  >
                    🔴 Live Projects
                  </Link>
                  <Link
                    to="/daily-reports"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === "/daily-reports"
                        ? "bg-blue-700 text-white"
                        : "text-blue-100 hover:text-white hover:bg-blue-700"
                    }`}
                  >
                    📊 Daily Reports
                  </Link>

                  {/* Debug link for development */}
                  {process.env.NODE_ENV === "development" && (
                    <Link
                      to="/debug/projects"
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        location.pathname === "/debug/projects"
                          ? "bg-red-700 text-white"
                          : "text-red-100 hover:text-white hover:bg-red-700"
                      }`}
                    >
                      🧪 Debug
                    </Link>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {/* User Section */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">
                        {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                    </div>
                    <div className="hidden sm:block">
                      <div className="text-sm font-medium">
                        {user?.fullName}
                      </div>
                      <div className="text-xs text-blue-200">
                        {user?.roleName}
                      </div>
                    </div>
                  </div>
                  <LogoutButton
                    variant="secondary"
                    size="sm"
                    redirectTo="/"
                    className="bg-blue-800 hover:bg-blue-900"
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;
