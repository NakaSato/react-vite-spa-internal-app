import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const publicNavItems = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/api-example", label: "API Demo" },
  ];

  const authenticatedNavItems = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/api-example", label: "API Demo" },
  ];

  const navItems = isAuthenticated ? authenticatedNavItems : publicNavItems;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-lg">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-bold hover:text-blue-200">
            Solar Projects SPA
          </Link>

          <div className="flex items-center space-x-4">
            {/* Navigation Links */}
            <div className="flex space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded transition-colors ${
                    location.pathname === item.path
                      ? "bg-blue-800 text-white"
                      : "hover:bg-blue-700"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* User Section */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4 border-l border-blue-500 pl-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-sm font-medium">{user?.fullName}</div>
                    <div className="text-xs text-blue-200">
                      {user?.roleName}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 text-sm bg-blue-800 hover:bg-blue-900 rounded transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="border-l border-blue-500 pl-4">
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded transition-colors ${
                    location.pathname === "/login"
                      ? "bg-blue-800 text-white"
                      : "bg-blue-700 hover:bg-blue-800"
                  }`}
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
