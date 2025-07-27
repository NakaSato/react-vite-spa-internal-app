import { useState, useEffect, useCallback } from "react";
import { projectsApi } from "../../../shared/utils/projectsApi";
import { ProjectDto } from "../../../shared/types/project";

export const useProjectData = (projectId: string | undefined) => {
  const [project, setProject] = useState<ProjectDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProject = useCallback(
    async (showRefreshing = false) => {
      if (!projectId) {
        setError("Project ID is required");
        setLoading(false);
        return;
      }

      try {
        if (showRefreshing) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }
        setError(null);
        setWarning(null);
        console.log(`🔍 [ProjectDetail] Fetching project: ${projectId}`);

        const projectData = await projectsApi.getProjectById(projectId);
        setProject(projectData);

        console.log(`✅ [ProjectDetail] Project loaded:`, projectData);
      } catch (err) {
        console.log(
          `⚠️ [ProjectDetail] Primary fetch failed, trying fallback...`
        );

        // Fallback: Try to get project from the projects list
        try {
          const projectsList = await projectsApi.getAllProjects();
          const fallbackProject = projectsList.items?.find(
            (p) => p.projectId === projectId
          );

          if (fallbackProject) {
            setProject(fallbackProject);
            console.log(
              `✅ [ProjectDetail] Project loaded from fallback:`,
              fallbackProject
            );
            // Show a warning that we're using fallback data
            setWarning(
              "Note: Using limited project data due to API issues. Some details may be unavailable."
            );
            return;
          }
        } catch (fallbackErr) {
          console.error(
            `❌ [ProjectDetail] Fallback also failed:`,
            fallbackErr
          );
        }

        // If both primary and fallback failed, show error
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load project";
        console.error(`❌ [ProjectDetail] Error fetching project:`, err);

        // Parse the error response for better error handling
        const errorResponse = (err as any)?.response;
        const errorBody = errorResponse?.body || "";
        const isServerError =
          errorBody.includes(
            "Object reference not set to an instance of an object"
          ) || errorBody.includes("Operation failed");
        const isAuthError =
          errorMessage.includes("401") ||
          errorMessage.includes("Authentication required") ||
          errorResponse?.status === 401;
        const isBadRequest =
          errorMessage.includes("400 Bad Request") ||
          errorResponse?.status === 400;

        console.log(`🔍 [ProjectDetail] Error analysis:`, {
          errorMessage,
          errorBody,
          isServerError,
          isAuthError,
          isBadRequest,
          responseStatus: errorResponse?.status,
        });

        if (isAuthError) {
          setError(
            "Authentication required. Please log in to view project details."
          );
        } else if (isServerError) {
          setError(
            `Server Error: The API encountered an issue retrieving this project. This appears to be a server-side null reference issue. Project ID: ${projectId}. Please try refreshing or contact support if the issue persists.`
          );
        } else if (
          errorMessage.includes("404") ||
          errorMessage.includes("not found") ||
          errorResponse?.status === 404
        ) {
          setError(
            `Project not found. The project ID "${projectId}" may be invalid or you may not have permission to view it.`
          );
        } else if (isBadRequest && !isServerError) {
          setError(
            "Authentication required. Please log in to view project details."
          );
        } else {
          setError(errorMessage);
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [projectId]
  );

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  return {
    project,
    loading,
    error,
    warning,
    refreshing,
    fetchProject,
    setError,
    setWarning,
  };
};
