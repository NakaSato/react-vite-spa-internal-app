import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../shared/hooks/useAuth";
import { mockProjects } from "../shared/data/mockProjects";

const Home: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Solar Projects Management SPA
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Comprehensive project management solution for solar energy
              installations
            </p>

            {isAuthenticated ? (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/dashboard"
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
                >
                  Go to Dashboard
                </Link>
                <span className="text-gray-600">
                  Welcome back, {user?.fullName}!
                </span>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/register"
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-lg font-semibold"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Project Management
            </h3>
            <p className="text-gray-600">
              Complete CRUD operations for solar projects with real-time status
              tracking and progress monitoring.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Authentication
            </h3>
            <p className="text-gray-600">
              Secure JWT-based authentication with role-based access control for
              different user types.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Real-time Updates
            </h3>
            <p className="text-gray-600">
              Live project updates and notifications to keep teams synchronized
              and informed.
            </p>
          </div>
        </div>

        {/* Demo Projects Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Demo Projects
          </h2>
          <p className="text-gray-600 mb-6">
            Explore our project management capabilities with these sample solar
            installations:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockProjects.map((project: any) => (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="block p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-blue-600">
                      {project.id}
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        project.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : project.status === "Construction"
                          ? "bg-blue-100 text-blue-800"
                          : project.status === "Design"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">
                      {project.progress}% Complete
                    </div>
                    <div className="w-16 h-2 bg-gray-200 rounded-full mt-1">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                <h3 className="font-semibold text-gray-900 mb-2">
                  {project.name}
                </h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>Client: {project.client}</div>
                  <div>System: {project.systemSize}</div>
                  <div>Location: {project.location}</div>
                  <div>Budget: ${project.budget.toLocaleString()}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Development Tools Section */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Development Tools
          </h2>
          <p className="text-gray-600 mb-6">
            Access comprehensive testing and debugging tools to ensure
            everything works perfectly:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              to="/integration-test"
              className="block p-6 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Integration Test Dashboard
                </h3>
              </div>
              <p className="text-gray-600">
                Comprehensive testing of API connectivity, project management,
                and data integration.
              </p>
            </Link>

            <Link
              to="/api-debug"
              className="block p-6 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  API Debug Tool
                </h3>
              </div>
              <p className="text-gray-600">
                Test API endpoints, debug connection issues, and validate data
                responses.
              </p>
            </Link>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Built With Modern Technology
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              "React 18",
              "TypeScript",
              "Tailwind CSS",
              "Vite",
              "React Router",
              "JWT Auth",
              "REST API",
              "Responsive Design",
              "Real-time Updates",
            ].map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
