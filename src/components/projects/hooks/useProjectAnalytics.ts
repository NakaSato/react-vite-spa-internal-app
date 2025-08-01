import { useState, useCallback } from "react";
import { projectsApi } from "../../../shared/utils/projectsApi";

export const useProjectAnalytics = () => {
  const [analytics, setAnalytics] = useState<any>(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      console.log(`📈 [ProjectDetail] Fetching project analytics`);

      // Get real analytics data from API
      const analyticsData = await projectsApi.getProjectAnalytics();

      // Transform API response to match component expectations
      const transformedAnalytics = {
        totalProjects: analyticsData.summary?.totalProjects || 0,
        activeProjects: analyticsData.summary?.activeProjects || 0,
        completedProjects: analyticsData.summary?.completedProjects || 0,
        planningProjects: analyticsData.statusBreakdown?.Planning || 0,
        onHoldProjects: analyticsData.statusBreakdown?.OnHold || 0,
        cancelledProjects: analyticsData.statusBreakdown?.Cancelled || 0,
        totalCapacityKw: analyticsData.summary?.totalCapacity || 0,
        totalPvModules: Math.floor(
          (analyticsData.summary?.totalCapacity || 0) * 2.5
        ), // Estimate: ~2.5 modules per kW
        totalRevenueValue: (analyticsData.summary?.totalCapacity || 0) * 5000, // Estimate: $5000 per kW
        projectManagerCount:
          Object.keys(analyticsData.topPerformers?.managers || {}).length || 0,
        lastUpdated: new Date().toISOString(),
      };

      setAnalytics(transformedAnalytics);
      console.log(
        `✅ [ProjectDetail] Real analytics loaded:`,
        transformedAnalytics
      );
    } catch (err) {
      console.error(`❌ [ProjectDetail] Error fetching analytics:`, err);
      // Set to null instead of fallback mock data
      setAnalytics(null);
    }
  }, []);

  return {
    analytics,
    fetchAnalytics,
  };
};
