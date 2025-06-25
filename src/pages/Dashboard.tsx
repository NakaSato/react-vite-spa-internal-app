import React, { useState } from "react";
import { useAuth, useRole } from "../contexts/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";

interface Project {
  id: string;
  name: string;
  client: string;
  status:
    | "Planning"
    | "Design"
    | "Permits"
    | "Construction"
    | "Inspection"
    | "Completed";
  progress: number;
  startDate: string;
  expectedCompletion: string;
  systemSize: string;
  location: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  assignedTeam: string[];
  budget: number;
  spent: number;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { isAdmin, isManager, roleName } = useRole();
  const [activeTab, setActiveTab] = useState<
    "overview" | "projects" | "construction" | "reports"
  >("overview");

  // Mock project data
  const projects: Project[] = [
    {
      id: "P001",
      name: "Residential Solar Installation - Johnson",
      client: "Johnson Family",
      status: "Construction",
      progress: 65,
      startDate: "2025-01-15",
      expectedCompletion: "2025-03-20",
      systemSize: "8.5 kW",
      location: "Austin, TX",
      priority: "High",
      assignedTeam: ["Team Alpha", "Electrical Crew A"],
      budget: 45000,
      spent: 29250,
    },
    {
      id: "P002",
      name: "Commercial Solar Array - TechCorp",
      client: "TechCorp Industries",
      status: "Design",
      progress: 30,
      startDate: "2025-02-01",
      expectedCompletion: "2025-05-15",
      systemSize: "250 kW",
      location: "Dallas, TX",
      priority: "Critical",
      assignedTeam: ["Team Beta", "Engineering Team"],
      budget: 525000,
      spent: 157500,
    },
    {
      id: "P003",
      name: "Community Solar Garden",
      client: "Green Valley Community",
      status: "Permits",
      progress: 15,
      startDate: "2025-01-10",
      expectedCompletion: "2025-07-30",
      systemSize: "1.2 MW",
      location: "Houston, TX",
      priority: "Medium",
      assignedTeam: ["Team Gamma", "Legal Team"],
      budget: 2100000,
      spent: 315000,
    },
    {
      id: "P004",
      name: "Industrial Rooftop System",
      client: "Manufacturing Plus",
      status: "Planning",
      progress: 5,
      startDate: "2025-03-01",
      expectedCompletion: "2025-08-15",
      systemSize: "500 kW",
      location: "San Antonio, TX",
      priority: "Low",
      assignedTeam: ["Team Delta"],
      budget: 875000,
      spent: 43750,
    },
  ];

  const getStatusColor = (status: Project["status"]) => {
    switch (status) {
      case "Planning":
        return "bg-gray-100 text-gray-800";
      case "Design":
        return "bg-blue-100 text-blue-800";
      case "Permits":
        return "bg-yellow-100 text-yellow-800";
      case "Construction":
        return "bg-orange-100 text-orange-800";
      case "Inspection":
        return "bg-purple-100 text-purple-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: Project["priority"]) => {
    switch (priority) {
      case "Low":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "High":
        return "bg-orange-100 text-orange-800";
      case "Critical":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
  const totalSpent = projects.reduce((sum, p) => sum + p.spent, 0);
  const totalCapacity = projects.reduce((sum, p) => {
    const size = parseFloat(p.systemSize);
    return sum + (p.systemSize.includes("MW") ? size * 1000 : size);
  }, 0);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        <div className="w-full h-full px-8 py-8">
          {/* Header */}
          <div className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl mb-8 border border-white/20">
            <div className="px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    INTERNAL CONSTRUCTION
                  </h1>
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Solar Projects Dashboard
                  </h2>
                  <p className="text-lg text-gray-600 flex items-center mt-2">
                    <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-3"></span>
                    Welcome back, <span className="font-semibold text-blue-600">{user?.fullName}</span> | {roleName} Role
                  </p>
                </div>
                <div className="hidden md:flex items-center space-x-6">
                  <div className="text-right bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 rounded-xl border border-blue-100">
                    <div className="text-sm text-gray-500">Current Date</div>
                    <div className="text-lg font-bold text-gray-900">
                      {new Date().toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl mb-8 border border-white/20">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-12 px-8">
                {[
                  { id: "overview", name: "Overview", icon: "📊" },
                  { id: "projects", name: "Projects", icon: "🏗️" },
                  { id: "construction", name: "Construction", icon: "⚡" },
                  { id: "reports", name: "Reports", icon: "📈" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-6 px-4 border-b-4 font-bold text-lg transition-all duration-300 ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600 bg-gradient-to-r from-blue-50 to-purple-50"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50"
                    }`}
                  >
                    <span className="mr-3 text-2xl">{tab.icon}</span>
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-10">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 overflow-hidden shadow-2xl rounded-2xl border border-blue-400 transform hover:scale-105 transition-all duration-300">
                  <div className="p-8 text-white">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                          <span className="text-4xl">🏗️</span>
                        </div>
                      </div>
                      <div className="ml-6 w-0 flex-1">
                        <dl>
                          <dt className="text-lg font-medium text-blue-100 truncate">
                            Active Projects
                          </dt>
                          <dd className="text-4xl font-bold text-white">
                            {projects.length}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 overflow-hidden shadow-2xl rounded-2xl border border-green-400 transform hover:scale-105 transition-all duration-300">
                  <div className="p-8 text-white">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                          <span className="text-4xl">⚡</span>
                        </div>
                      </div>
                      <div className="ml-6 w-0 flex-1">
                        <dl>
                          <dt className="text-lg font-medium text-green-100 truncate">
                            Total Capacity
                          </dt>
                          <dd className="text-4xl font-bold text-white">
                            {totalCapacity.toFixed(1)} kW
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 overflow-hidden shadow-2xl rounded-2xl border border-purple-400 transform hover:scale-105 transition-all duration-300">
                  <div className="p-8 text-white">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                          <span className="text-4xl">💰</span>
                        </div>
                      </div>
                      <div className="ml-6 w-0 flex-1">
                        <dl>
                          <dt className="text-lg font-medium text-purple-100 truncate">
                            Total Budget
                          </dt>
                          <dd className="text-4xl font-bold text-white">
                            ${(totalBudget / 1000000).toFixed(1)}M
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-red-500 overflow-hidden shadow-2xl rounded-2xl border border-orange-400 transform hover:scale-105 transition-all duration-300">
                  <div className="p-8 text-white">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                          <span className="text-4xl">📊</span>
                        </div>
                      </div>
                      <div className="ml-6 w-0 flex-1">
                        <dl>
                          <dt className="text-lg font-medium text-orange-100 truncate">
                            Budget Used
                          </dt>
                          <dd className="text-4xl font-bold text-white">
                            {((totalSpent / totalBudget) * 100).toFixed(1)}%
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Status Overview */}
              <div className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl border border-white/20">
                <div className="px-8 py-6 border-b border-gray-200">
                  <h3 className="text-3xl font-bold text-gray-900">
                    Project Status Overview
                  </h3>
                </div>
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.slice(0, 3).map((project) => (
                      <div
                        key={project.id}
                        className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                      >
                        <h4 className="text-xl font-bold text-gray-900 mb-6">
                          {project.name}
                        </h4>
                        <div className="space-y-6">
                          <div className="flex justify-between text-lg">
                            <span className="text-gray-600 font-medium">Status:</span>
                            <span
                              className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(
                                project.status
                              )}`}
                            >
                              {project.status}
                            </span>
                          </div>
                          <div className="flex justify-between text-lg">
                            <span className="text-gray-600 font-medium">Progress:</span>
                            <span className="text-gray-900 font-bold">
                              {project.progress}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-300 rounded-full h-4">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-500 shadow-lg"
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Projects Tab */}
          {activeTab === "projects" && (
            <div className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl border border-white/20">
              <div className="px-8 py-6 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-3xl font-bold text-gray-900">
                  All Projects
                </h3>
                {(isAdmin || isManager) && (
                  <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105">
                    + New Project
                  </button>
                )}
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
                    <tr>
                      <th className="px-8 py-6 text-left text-sm font-bold text-gray-800 uppercase tracking-wider">
                        Project
                      </th>
                      <th className="px-8 py-6 text-left text-sm font-bold text-gray-800 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-8 py-6 text-left text-sm font-bold text-gray-800 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-8 py-6 text-left text-sm font-bold text-gray-800 uppercase tracking-wider">
                        Progress
                      </th>
                      <th className="px-8 py-6 text-left text-sm font-bold text-gray-800 uppercase tracking-wider">
                        System Size
                      </th>
                      <th className="px-8 py-6 text-left text-sm font-bold text-gray-800 uppercase tracking-wider">
                        Priority
                      </th>
                      <th className="px-8 py-6 text-left text-sm font-bold text-gray-800 uppercase tracking-wider">
                        Budget
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {projects.map((project, index) => (
                      <tr key={project.id} className={`hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div>
                            <div className="text-lg font-bold text-gray-900">
                              {project.name}
                            </div>
                            <div className="text-sm text-gray-600 font-medium">
                              📍 {project.location}
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap text-lg font-semibold text-gray-900">{project.client}</td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <span
                            className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(
                              project.status
                            )}`}
                          >
                            {project.status}
                          </span>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-24 bg-gray-200 rounded-full h-4 mr-4">
                              <div
                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-500 shadow-lg"
                                style={{ width: `${project.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-lg font-bold text-gray-900">
                              {project.progress}%
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap text-lg font-bold text-gray-900">{project.systemSize}</td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <span
                            className={`px-4 py-2 rounded-full text-sm font-bold ${getPriorityColor(
                              project.priority
                            )}`}
                          >
                            {project.priority}
                          </span>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap text-lg font-bold text-gray-900">
                          ${(project.budget / 1000).toFixed(0)}k
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Construction Tab */}
          {activeTab === "construction" && (
            <div className="space-y-8">
              <div className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl border border-white/20">
                <div className="px-8 py-6 border-b border-gray-200">
                  <h3 className="text-3xl font-bold text-gray-900">
                    Active Construction Projects
                  </h3>
                </div>
                <div className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {projects
                      .filter((p) => p.status === "Construction")
                      .map((project) => (
                        <div
                          key={project.id}
                          className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300"
                        >
                          <h4 className="text-2xl font-bold text-gray-900 mb-6">
                            {project.name}
                          </h4>
                          <div className="space-y-6">
                            <div className="flex justify-between">
                              <span className="text-lg text-gray-600 font-medium">
                                Progress:
                              </span>
                              <span className="text-lg font-bold">
                                {project.progress}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-4">
                              <div
                                className="bg-gradient-to-r from-orange-500 to-red-500 h-4 rounded-full shadow-lg"
                                style={{ width: `${project.progress}%` }}
                              ></div>
                            </div>
                            <div className="grid grid-cols-2 gap-6 text-base">
                              <div>
                                <span className="text-gray-600 font-medium">Client:</span>
                                <p className="font-bold text-gray-900">{project.client}</p>
                              </div>
                              <div>
                                <span className="text-gray-600 font-medium">
                                  System Size:
                                </span>
                                <p className="font-bold text-gray-900">
                                  {project.systemSize}
                                </p>
                              </div>
                              <div>
                                <span className="text-gray-600 font-medium">Location:</span>
                                <p className="font-bold text-gray-900">
                                  {project.location}
                                </p>
                              </div>
                              <div>
                                <span className="text-gray-600 font-medium">
                                  Expected Completion:
                                </span>
                                <p className="font-bold text-gray-900">
                                  {new Date(
                                    project.expectedCompletion
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="pt-6 border-t border-gray-200">
                              <span className="text-base text-gray-600 font-medium">
                                Assigned Teams:
                              </span>
                              <div className="mt-3 flex flex-wrap gap-3">
                                {project.assignedTeam.map((team, index) => (
                                  <span
                                    key={index}
                                    className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-bold"
                                  >
                                    {team}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === "reports" && (
            <div className="space-y-8">
              <div className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl border border-white/20">
                <div className="px-8 py-6 border-b border-gray-200">
                  <h3 className="text-3xl font-bold text-gray-900">
                    Financial Summary
                  </h3>
                </div>
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl">
                      <div className="text-4xl font-bold text-green-600">
                        ${(totalBudget / 1000000).toFixed(1)}M
                      </div>
                      <div className="text-lg text-gray-600 font-medium mt-2">Total Budget</div>
                    </div>
                    <div className="text-center bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl">
                      <div className="text-4xl font-bold text-blue-600">
                        ${(totalSpent / 1000000).toFixed(1)}M
                      </div>
                      <div className="text-lg text-gray-600 font-medium mt-2">Total Spent</div>
                    </div>
                    <div className="text-center bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-2xl">
                      <div className="text-4xl font-bold text-orange-600">
                        {((totalSpent / totalBudget) * 100).toFixed(1)}%
                      </div>
                      <div className="text-lg text-gray-600 font-medium mt-2">
                        Budget Utilization
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl border border-white/20">
                <div className="px-8 py-6 border-b border-gray-200">
                  <h3 className="text-3xl font-bold text-gray-900">
                    Project Status Distribution
                  </h3>
                </div>
                <div className="p-8">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {[
                      "Planning",
                      "Design",
                      "Permits",
                      "Construction",
                      "Inspection",
                      "Completed",
                    ].map((status) => {
                      const count = projects.filter(
                        (p) => p.status === status
                      ).length;
                      return (
                        <div key={status} className="text-center bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl hover:shadow-lg transition-all duration-300">
                          <div className="text-3xl font-bold text-gray-900">
                            {count}
                          </div>
                          <div className="text-base text-gray-600 font-medium mt-2">{status}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
