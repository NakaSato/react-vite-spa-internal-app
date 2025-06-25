import React from "react";
import { useAuth, useRole } from "../contexts/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { isAdmin, isManager, roleName } = useRole();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-6 py-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Solar Projects Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Welcome back, {user?.fullName}
              </p>
            </div>
          </div>

          {/* User Info Card */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-6 py-4">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Account Information
              </h2>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd className="text-sm text-gray-900">{user?.fullName}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="text-sm text-gray-900">{user?.email}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Username
                  </dt>
                  <dd className="text-sm text-gray-900">{user?.username}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Role</dt>
                  <dd className="text-sm text-gray-900">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        isAdmin
                          ? "bg-red-100 text-red-800"
                          : isManager
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {roleName}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Role-based Content */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Admin Panel */}
            {isAdmin && (
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    Admin Panel
                  </h3>
                </div>
                <div className="px-6 py-4">
                  <p className="text-sm text-gray-600 mb-4">
                    You have full administrative access to the system.
                  </p>
                  <div className="space-y-2">
                    <button className="w-full text-left px-4 py-2 text-sm bg-red-50 text-red-700 rounded hover:bg-red-100">
                      Manage Users
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100">
                      System Settings
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm bg-purple-50 text-purple-700 rounded hover:bg-purple-100">
                      View All Projects
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Manager Panel */}
            {isManager && (
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    Manager Tools
                  </h3>
                </div>
                <div className="px-6 py-4">
                  <p className="text-sm text-gray-600 mb-4">
                    Manage your team and projects effectively.
                  </p>
                  <div className="space-y-2">
                    <button className="w-full text-left px-4 py-2 text-sm bg-yellow-50 text-yellow-700 rounded hover:bg-yellow-100">
                      Team Projects
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm bg-green-50 text-green-700 rounded hover:bg-green-100">
                      Project Reports
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm bg-indigo-50 text-indigo-700 rounded hover:bg-indigo-100">
                      Resource Planning
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Quick Actions
                </h3>
              </div>
              <div className="px-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="text-2xl mb-2">☀️</div>
                    <span className="text-sm font-medium">New Project</span>
                  </button>
                  <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="text-2xl mb-2">📊</div>
                    <span className="text-sm font-medium">View Reports</span>
                  </button>
                  <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="text-2xl mb-2">⚙️</div>
                    <span className="text-sm font-medium">Settings</span>
                  </button>
                  <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="text-2xl mb-2">👥</div>
                    <span className="text-sm font-medium">Team</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Recent Activity
                </h3>
              </div>
              <div className="px-6 py-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm text-gray-600">
                      Project Alpha - Site survey completed
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-sm text-gray-600">
                      Project Beta - Installation phase started
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span className="text-sm text-gray-600">
                      Project Gamma - Pending approval
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
