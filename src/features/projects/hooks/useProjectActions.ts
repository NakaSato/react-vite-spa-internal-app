import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { projectsApi } from "../../../shared/utils/projectsApi";
import { ProjectDto } from "../../../shared/types/project";

export const useProjectActions = (
  project: ProjectDto | null,
  projectId: string | undefined,
  user: any,
  onRefreshProject: () => void,
  onRefreshPerformance: () => void,
  setError: (error: string | null) => void,
  setWarning?: (warning: string | null) => void
) => {
  const navigate = useNavigate();
  const [statusUpdating, setStatusUpdating] = useState(false);

  const handleStatusUpdate = useCallback(
    async (newStatus: string) => {
      if (!project || !projectId) return;

      // Status transition validation
      const currentStatus = project.status?.toLowerCase();
      const newStatusLower = newStatus.toLowerCase();

      const validTransitions: Record<string, string[]> = {
        planning: ["inprogress", "cancelled"],
        inprogress: ["onhold", "completed", "cancelled"],
        onhold: ["inprogress", "cancelled"],
        completed: [], // Final state
        cancelled: [], // Final state
      };

      if (
        currentStatus &&
        validTransitions[currentStatus] &&
        !validTransitions[currentStatus].includes(newStatusLower)
      ) {
        setError(
          `Invalid status transition from ${project.status} to ${newStatus}`
        );
        return;
      }

      try {
        setStatusUpdating(true);

        // Use the PATCH endpoint for status updates with workflow
        const statusUpdate = {
          status: newStatus as
            | "Planning"
            | "InProgress"
            | "Completed"
            | "OnHold"
            | "Cancelled",
          reason: `Status changed by ${user?.fullName || user?.username}`,
          effectiveDate: new Date().toISOString(),
          notifyStakeholders: true,
        };

        await projectsApi.patchProject(projectId, statusUpdate);

        // Refresh project data and performance
        onRefreshProject();
        if (newStatus.toLowerCase() === "completed") {
          onRefreshPerformance();
        }

        console.log(`✅ [ProjectDetail] Status updated to: ${newStatus}`);
      } catch (err) {
        console.error(`❌ [ProjectDetail] Failed to update status:`, err);
        setError(
          err instanceof Error ? err.message : "Failed to update status"
        );
      } finally {
        setStatusUpdating(false);
      }
    },
    [project, projectId, user, onRefreshProject, onRefreshPerformance, setError]
  );

  const handleDelete = useCallback(async () => {
    if (!project || !projectId) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${project.projectName}"? This action cannot be undone.`
    );

    if (!confirmDelete) return;

    try {
      await projectsApi.deleteProject(projectId);
      console.log(`✅ [ProjectDetail] Project deleted: ${projectId}`);
      navigate("/dashboard");
    } catch (err) {
      console.error(`❌ [ProjectDetail] Failed to delete project:`, err);
      setError(err instanceof Error ? err.message : "Failed to delete project");
    }
  }, [project, projectId, navigate, setError]);

  const handleCreateTemplate = useCallback(async () => {
    if (!project || !projectId) return;

    try {
      console.log(
        `📋 [ProjectDetail] Creating template from project: ${projectId}`
      );
      // Simulate template creation (replace with actual API when available)
      // await projectsApi.createProjectTemplate(projectId);

      alert(`Template created successfully from "${project.projectName}"`);
    } catch (err) {
      console.error(`❌ [ProjectDetail] Failed to create template:`, err);
      setError(
        err instanceof Error ? err.message : "Failed to create template"
      );
    }
  }, [project, projectId, setError]);

  const handleAdvancedSearch = useCallback(() => {
    const searchParams = new URLSearchParams({
      q: project?.projectName || "",
      filters: JSON.stringify({
        status: project?.status,
        managerId: project?.projectManager?.userId,
      }),
    });

    navigate(`/projects/search?${searchParams.toString()}`);
  }, [project, navigate]);

  return {
    statusUpdating,
    handleStatusUpdate,
    handleDelete,
    handleCreateTemplate,
    handleAdvancedSearch,
  };
};
