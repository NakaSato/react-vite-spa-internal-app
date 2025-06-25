import React, { useState } from "react";
import { useAuth, useRole } from "../hooks/useAuth";
import ProtectedRoute from "../components/ProtectedRoute";
import NavigationTabs from "../components/NavigationTabs";
import OverviewTab from "../components/OverviewTab";
import ProjectsTab from "../components/ProjectsTab";
import ConstructionTab from "../components/ConstructionTab";
import ReportsTab from "../components/ReportsTab";
import CreateProjectModal from "../components/CreateProjectModal";
import { NewProjectForm, TabType } from "../types/project";
import { useProjects } from "../hooks/useProjects";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { isAdmin, isManager, roleName } = useRole();
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Use the projects hook with API integration
  const {
    projects,
    loading,
    error,
    stats,
    statsLoading,
    createProject,
    updateProject,
    deleteProject,
    refreshProjects,
    refreshStats,
    getConstructionProjects,
    getProjectStats,
  } = useProjects();

  const [newProject, setNewProject] = useState<NewProjectForm>({
    projectName: "",
    address: "",
    clientInfo: "",
    status: "Planning",
    startDate: "",
    estimatedEndDate: "",
    totalCapacityKw: 0,
    pvModuleCount: 0,
    ftsValue: 0,
    revenueValue: 0,
    pqmValue: 0,
    inverter125Kw: 0,
    inverter80Kw: 0,
    inverter60Kw: 0,
    inverter40Kw: 0,
    latitude: 0,
    longitude: 0,
    connectionType: "LV",
    connectionNotes: "",
  });

  const handleCreateProject = async () => {
    try {
      await createProject(newProject);

      // Reset form and close modal
      setNewProject({
        projectName: "",
        address: "",
        clientInfo: "",
        status: "Planning",
        startDate: "",
        estimatedEndDate: "",
        totalCapacityKw: 0,
        pvModuleCount: 0,
        ftsValue: 0,
        revenueValue: 0,
        pqmValue: 0,
        inverter125Kw: 0,
        inverter80Kw: 0,
        inverter60Kw: 0,
        inverter40Kw: 0,
        latitude: 0,
        longitude: 0,
        connectionType: "LV",
        connectionNotes: "",
      });
      setShowCreateModal(false);

      alert("Project created successfully!");
    } catch (error) {
      console.error("Failed to create project:", error);
      alert("Failed to create project. Please try again.");
    }
  };

  const handleInputChange = (field: keyof NewProjectForm, value: any) => {
    setNewProject((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="w-full h-full px-8 py-8">
          <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-lg text-gray-600">
                Loading projects...
              </span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-yellow-400">⚠️</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content */}
          {!loading && (
            <>
              {activeTab === "overview" && (
                <OverviewTab
                  projects={projects}
                  stats={stats}
                  statsLoading={statsLoading}
                />
              )}

              {activeTab === "projects" && (
                <ProjectsTab
                  projects={projects}
                  isAdmin={isAdmin}
                  isManager={isManager}
                  onCreateProject={() => setShowCreateModal(true)}
                />
              )}

              {activeTab === "construction" && (
                <ConstructionTab projects={projects} />
              )}

              {activeTab === "reports" && <ReportsTab projects={projects} />}
            </>
          )}

          <CreateProjectModal
            showModal={showCreateModal}
            newProject={newProject}
            onClose={() => setShowCreateModal(false)}
            onInputChange={handleInputChange}
            onCreateProject={handleCreateProject}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
