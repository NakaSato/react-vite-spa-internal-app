import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../shared/hooks/useAuth";
import { LogoutButton } from "../features/auth";

export function Navigation() {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  return (
    <>
      <nav className="bg-blue-600 p-4 text-white shadow-lg">
        <div className="w-full max-w-none px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-xl font-bold hover:text-blue-200">
                INTERNAL CONSTRUCTION
              </Link>

              {/* Navigation Links */}
              {isAuthenticated && (
                <div className="ml-8 hidden items-center space-x-4 md:flex">
                  <Link
                    to="/dashboard"
                    className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      location.pathname === "/dashboard"
                        ? "bg-blue-700 text-white"
                        : "text-blue-100 hover:bg-blue-700 hover:text-white"
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/projects/realtime"
                    className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      location.pathname === "/projects/realtime"
                        ? "bg-blue-700 text-white"
                        : "text-blue-100 hover:bg-blue-700 hover:text-white"
                    }`}
                  >
                    Live Projects
                  </Link>
                  <Link
                    to="/daily-reports"
                    className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      location.pathname === "/daily-reports"
                        ? "bg-blue-700 text-white"
                        : "text-blue-100 hover:bg-blue-700 hover:text-white"
                    }`}
                  >
                    Daily Reports
                  </Link>

                  {/* Debug and MUI Showcase links for development */}
                  {import.meta.env.DEV && (
                    <>
                      <Link
                        to="/mui-showcase"
                        className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                          location.pathname === "/mui-showcase"
                            ? "bg-purple-700 text-white"
                            : "text-purple-100 hover:bg-purple-700 hover:text-white"
                        }`}
                      >
                        🎨 MUI Showcase
                      </Link>
                      <Link
                        to="/debug/projects"
                        className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                          location.pathname === "/debug/projects"
                            ? "bg-red-700 text-white"
                            : "text-red-100 hover:bg-red-700 hover:text-white"
                        }`}
                      >
                        Debug
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {/* User Section */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-800">
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
}

export default Navigation;
