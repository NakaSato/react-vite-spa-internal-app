import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-lg">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-bold hover:text-blue-200">
            INTERNAL CONSTRUCTION
          </Link>

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
              <div>
                <Link
                  to="/login"
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 rounded transition-colors"
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
