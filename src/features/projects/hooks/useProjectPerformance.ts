import { useState, useCallback } from "react";
import { projectsApi } from "../../../shared/utils/projectsApi";

export const useProjectPerformance = () => {
  const [performance, setPerformance] = useState<any>(null);
  const [loadingPerformance, setLoadingPerformance] = useState(false);

  const fetchPerformance = useCallback(async (projectId?: string) => {
    if (!projectId) return;

    try {
      setLoadingPerformance(true);
      console.log(`📊 [ProjectDetail] Fetching performance data: ${projectId}`);

      // Use real API for performance data
      const performanceData = await projectsApi.getProjectPerformance(
        projectId
      );

      setPerformance(performanceData);
      console.log(
        `✅ [ProjectDetail] Performance data loaded:`,
        performanceData
      );
    } catch (err) {
      console.error(`❌ [ProjectDetail] Error fetching performance:`, err);
      // Set performance to null instead of mock data when API fails
      setPerformance(null);
    } finally {
      setLoadingPerformance(false);
    }
  }, []);

  return {
    performance,
    loadingPerformance,
    fetchPerformance,
  };
};
