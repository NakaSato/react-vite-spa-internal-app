// Business Logic for Progress Calculation
// Implements the weighted calculation formulas from MASTER_PLAN_OF_PROJECT.md

import {
  ProjectEntity,
  Phase,
  Activity,
  ProgressCalculation,
  PhaseCompletion,
  ProjectHealth,
  TaskDependency,
  DependencyType,
  ActivityStatus,
} from "../types/project-management";

/**
 * Progress Calculation Engine
 * Implements the hierarchical weighted progress calculation from the master plan
 */
export class ProgressCalculationEngine {
  /**
   * Calculate overall project completion using weighted phase completion
   * Formula: OverallProjectCompletion = Σ(PhaseCompletion × PhaseWeight)
   */
  static calculateOverallProgress(project: ProjectEntity): number {
    if (!project.phases || project.phases.length === 0) {
      return 0;
    }

    let totalWeightedCompletion = 0;
    let totalWeight = 0;

    for (const phase of project.phases) {
      const phaseCompletion = this.calculatePhaseCompletion(phase);
      totalWeightedCompletion += phaseCompletion * phase.weight;
      totalWeight += phase.weight;
    }

    // Normalize by total weight (should be 1.0 for properly configured projects)
    return totalWeight > 0 ? totalWeightedCompletion / totalWeight : 0;
  }

  /**
   * Calculate phase completion using weighted average of activities
   * Formula: PhaseCompletion = Σ(ActivityCompletion × ActivityWeight) / Σ(ActivityWeight)
   * where ActivityWeight = ActivityDuration if not explicitly set
   */
  static calculatePhaseCompletion(phase: Phase): number {
    if (!phase.activities || phase.activities.length === 0) {
      return 0;
    }

    let totalWeightedCompletion = 0;
    let totalWeight = 0;

    for (const activity of phase.activities) {
      const activityWeight = activity.weight || activity.duration; // Use duration as proxy for effort
      totalWeightedCompletion += activity.percentComplete * activityWeight;
      totalWeight += activityWeight;
    }

    return totalWeight > 0 ? totalWeightedCompletion / totalWeight : 0;
  }

  /**
   * Recursive function to calculate weighted completion for hierarchical tasks
   * This future-proofs the system for sub-activities as mentioned in the master plan
   */
  static calculateWeightedCompletion(activities: Activity[]): number {
    if (!activities || activities.length === 0) {
      return 0;
    }

    let totalWeightedCompletion = 0;
    let totalWeight = 0;

    for (const activity of activities) {
      const weight = activity.weight || activity.duration;

      // If this activity has sub-activities (future extension), calculate recursively
      // For now, use the activity's direct completion
      const completion = activity.percentComplete;

      totalWeightedCompletion += completion * weight;
      totalWeight += weight;
    }

    return totalWeight > 0 ? totalWeightedCompletion / totalWeight : 0;
  }

  /**
   * Generate comprehensive progress calculation report
   */
  static generateProgressReport(project: ProjectEntity): ProgressCalculation {
    const phaseCompletions: PhaseCompletion[] = project.phases.map((phase) => {
      const completion = this.calculatePhaseCompletion(phase);
      const contributionToOverall = completion * phase.weight;
      const onSchedule = this.isPhaseOnSchedule(phase);
      const daysAhead = this.calculateScheduleVariance(phase);

      return {
        phaseId: phase.phaseId,
        phaseName: phase.phaseName,
        completion,
        weight: phase.weight,
        contributionToOverall,
        onSchedule,
        daysAhead,
      };
    });

    const overallCompletion = this.calculateOverallProgress(project);
    const criticalPath = this.calculateCriticalPath(project);
    const projectHealth = this.assessProjectHealth(project, phaseCompletions);

    return {
      projectId: project.projectId,
      overallCompletion,
      phaseCompletions,
      calculatedAt: new Date(),
      criticalPath,
      projectHealth,
    };
  }

  /**
   * Calculate Critical Path using Forward and Backward Pass
   * Returns array of activity IDs on the critical path
   */
  static calculateCriticalPath(project: ProjectEntity): string[] {
    const allActivities: Activity[] = [];
    const dependencies: TaskDependency[] = [];

    // Flatten all activities and dependencies
    project.phases.forEach((phase) => {
      allActivities.push(...phase.activities);
      phase.activities.forEach((activity) => {
        dependencies.push(...activity.dependencies);
      });
    });

    if (allActivities.length === 0) {
      return [];
    }

    // Create activity map for quick lookup
    const activityMap = new Map<string, Activity>();
    allActivities.forEach((activity) => {
      activityMap.set(activity.activityId, activity);
    });

    // Forward Pass - Calculate Early Start and Early Finish
    const earlyStart = new Map<string, number>();
    const earlyFinish = new Map<string, number>();

    // Initialize all activities
    allActivities.forEach((activity) => {
      earlyStart.set(activity.activityId, 0);
      earlyFinish.set(activity.activityId, activity.duration);
    });

    // Calculate forward pass
    const visited = new Set<string>();
    const calculateForwardPass = (activityId: string): void => {
      if (visited.has(activityId)) return;
      visited.add(activityId);

      const activity = activityMap.get(activityId);
      if (!activity) return;

      let maxEarlyStart = 0;

      // Find all predecessors
      const predecessors = dependencies.filter(
        (dep) => dep.successorId === activityId
      );

      for (const dep of predecessors) {
        calculateForwardPass(dep.predecessorId);
        const predFinish = earlyFinish.get(dep.predecessorId) || 0;

        // Apply dependency type logic
        let requiredStart = 0;
        switch (dep.dependencyType) {
          case DependencyType.FINISH_TO_START:
            requiredStart = predFinish + dep.lagTime;
            break;
          case DependencyType.START_TO_START:
            requiredStart =
              (earlyStart.get(dep.predecessorId) || 0) + dep.lagTime;
            break;
          case DependencyType.FINISH_TO_FINISH:
            requiredStart = predFinish - activity.duration + dep.lagTime;
            break;
          case DependencyType.START_TO_FINISH:
            requiredStart =
              (earlyStart.get(dep.predecessorId) || 0) -
              activity.duration +
              dep.lagTime;
            break;
        }

        maxEarlyStart = Math.max(maxEarlyStart, requiredStart);
      }

      earlyStart.set(activityId, maxEarlyStart);
      earlyFinish.set(activityId, maxEarlyStart + activity.duration);
    };

    // Calculate forward pass for all activities
    allActivities.forEach((activity) => {
      calculateForwardPass(activity.activityId);
    });

    // Backward Pass - Calculate Late Start and Late Finish
    const lateStart = new Map<string, number>();
    const lateFinish = new Map<string, number>();

    // Find project end date (maximum early finish)
    const projectEndDate = Math.max(...Array.from(earlyFinish.values()));

    // Initialize late dates
    allActivities.forEach((activity) => {
      const hasSuccessors = dependencies.some(
        (dep) => dep.predecessorId === activity.activityId
      );
      if (!hasSuccessors) {
        // End activity
        lateFinish.set(activity.activityId, projectEndDate);
        lateStart.set(activity.activityId, projectEndDate - activity.duration);
      }
    });

    // Calculate backward pass
    const visitedBackward = new Set<string>();
    const calculateBackwardPass = (activityId: string): void => {
      if (visitedBackward.has(activityId)) return;
      visitedBackward.add(activityId);

      const activity = activityMap.get(activityId);
      if (!activity) return;

      // If already calculated (end activity), skip
      if (lateFinish.has(activityId)) return;

      let minLateFinish = Infinity;

      // Find all successors
      const successors = dependencies.filter(
        (dep) => dep.predecessorId === activityId
      );

      for (const dep of successors) {
        calculateBackwardPass(dep.successorId);
        const succStart = lateStart.get(dep.successorId) || 0;

        // Apply dependency type logic for backward pass
        let requiredFinish = Infinity;
        switch (dep.dependencyType) {
          case DependencyType.FINISH_TO_START:
            requiredFinish = succStart - dep.lagTime;
            break;
          case DependencyType.START_TO_START:
            requiredFinish = succStart - dep.lagTime + activity.duration;
            break;
          case DependencyType.FINISH_TO_FINISH:
            requiredFinish =
              (lateFinish.get(dep.successorId) || 0) - dep.lagTime;
            break;
          case DependencyType.START_TO_FINISH:
            requiredFinish =
              (lateFinish.get(dep.successorId) || 0) -
              dep.lagTime +
              activity.duration;
            break;
        }

        minLateFinish = Math.min(minLateFinish, requiredFinish);
      }

      if (minLateFinish !== Infinity) {
        lateFinish.set(activityId, minLateFinish);
        lateStart.set(activityId, minLateFinish - activity.duration);
      }
    };

    // Calculate backward pass for all activities
    allActivities.forEach((activity) => {
      calculateBackwardPass(activity.activityId);
    });

    // Identify critical activities (activities with zero total float)
    const criticalActivities: string[] = [];

    allActivities.forEach((activity) => {
      const es = earlyStart.get(activity.activityId) || 0;
      const ls = lateStart.get(activity.activityId) || 0;
      const totalFloat = ls - es;

      if (Math.abs(totalFloat) < 0.001) {
        // Account for floating point precision
        criticalActivities.push(activity.activityId);
        // Mark activity as on critical path
        activity.isOnCriticalPath = true;
      } else {
        activity.isOnCriticalPath = false;
      }
    });

    return criticalActivities;
  }

  /**
   * Check if a phase is on schedule
   */
  private static isPhaseOnSchedule(phase: Phase): boolean {
    const now = new Date();
    const plannedProgress = this.calculatePlannedProgress(
      phase.startDate,
      phase.endDate,
      now
    );
    const actualProgress = this.calculatePhaseCompletion(phase);

    // Consider on schedule if within 5% of planned progress
    return actualProgress >= plannedProgress - 0.05;
  }

  /**
   * Calculate planned progress based on time elapsed
   */
  private static calculatePlannedProgress(
    startDate: Date,
    endDate: Date,
    currentDate: Date
  ): number {
    if (currentDate <= startDate) return 0;
    if (currentDate >= endDate) return 1;

    const totalDuration = endDate.getTime() - startDate.getTime();
    const elapsedDuration = currentDate.getTime() - startDate.getTime();

    return elapsedDuration / totalDuration;
  }

  /**
   * Calculate schedule variance in days
   */
  private static calculateScheduleVariance(phase: Phase): number {
    const now = new Date();
    const plannedProgress = this.calculatePlannedProgress(
      phase.startDate,
      phase.endDate,
      now
    );
    const actualProgress = this.calculatePhaseCompletion(phase);

    const totalDurationDays =
      (phase.endDate.getTime() - phase.startDate.getTime()) /
      (1000 * 60 * 60 * 24);
    const progressDifference = actualProgress - plannedProgress;

    return progressDifference * totalDurationDays;
  }

  /**
   * Assess overall project health
   */
  private static assessProjectHealth(
    project: ProjectEntity,
    phaseCompletions: PhaseCompletion[]
  ): ProjectHealth {
    const riskFactors: string[] = [];
    const recommendations: string[] = [];

    // Check for phases behind schedule
    const phasesAtRisk = phaseCompletions.filter(
      (pc) => !pc.onSchedule && pc.daysAhead < -7
    );
    if (phasesAtRisk.length > 0) {
      riskFactors.push(`${phasesAtRisk.length} phase(s) behind schedule`);
      recommendations.push("Review resource allocation for delayed phases");
    }

    // Check for critical path delays
    const criticalPathActivities = project.phases
      .flatMap((p) => p.activities)
      .filter((a) => a.isOnCriticalPath && a.status === ActivityStatus.OVERDUE);

    if (criticalPathActivities.length > 0) {
      riskFactors.push("Critical path activities are overdue");
      recommendations.push("Prioritize critical path activities immediately");
    }

    // Calculate overall schedule variance
    const scheduleVariance = phaseCompletions.reduce(
      (acc, pc) => acc + pc.daysAhead * pc.weight,
      0
    );

    // Determine health status
    let status: "healthy" | "at_risk" | "critical" = "healthy";

    if (scheduleVariance < -14 || criticalPathActivities.length > 0) {
      status = "critical";
    } else if (scheduleVariance < -7 || phasesAtRisk.length > 0) {
      status = "at_risk";
    }

    return {
      status,
      riskFactors,
      recommendations,
      scheduleVariance,
      budgetVariance: 0, // TODO: Implement budget variance calculation
    };
  }
}

/**
 * Resource Conflict Detection
 * Identifies scheduling conflicts where resources are double-booked
 */
export class ResourceConflictDetector {
  /**
   * Detect resource conflicts across all activities
   */
  static detectConflicts(project: ProjectEntity): Array<{
    resourceId: string;
    conflictingActivities: string[];
    conflictPeriod: { start: Date; end: Date };
  }> {
    const conflicts: Array<{
      resourceId: string;
      conflictingActivities: string[];
      conflictPeriod: { start: Date; end: Date };
    }> = [];

    const allActivities = project.phases.flatMap((p) => p.activities);
    const resourceSchedule = new Map<
      string,
      Array<{ activityId: string; start: Date; end: Date }>
    >();

    // Build resource schedule
    allActivities.forEach((activity) => {
      activity.assignedResources.forEach((resourceId) => {
        if (!resourceSchedule.has(resourceId)) {
          resourceSchedule.set(resourceId, []);
        }
        resourceSchedule.get(resourceId)!.push({
          activityId: activity.activityId,
          start: activity.startDate,
          end: activity.endDate,
        });
      });
    });

    // Check for overlaps
    resourceSchedule.forEach((schedule, resourceId) => {
      for (let i = 0; i < schedule.length; i++) {
        for (let j = i + 1; j < schedule.length; j++) {
          const activity1 = schedule[i];
          const activity2 = schedule[j];

          // Check for overlap
          if (
            activity1.start < activity2.end &&
            activity2.start < activity1.end
          ) {
            conflicts.push({
              resourceId,
              conflictingActivities: [
                activity1.activityId,
                activity2.activityId,
              ],
              conflictPeriod: {
                start: new Date(
                  Math.max(activity1.start.getTime(), activity2.start.getTime())
                ),
                end: new Date(
                  Math.min(activity1.end.getTime(), activity2.end.getTime())
                ),
              },
            });
          }
        }
      }
    });

    return conflicts;
  }
}

/**
 * Baseline Comparison
 * Compares current progress against baseline plan
 */
export class BaselineComparison {
  /**
   * Compare current project state against baseline
   */
  static compareToBaseline(
    current: ProjectEntity,
    baseline: ProjectEntity
  ): {
    scheduleVariance: number; // days
    scopeChanges: string[];
    milestonesAtRisk: string[];
  } {
    // Implementation for baseline comparison
    // This would compare current vs baseline schedules, identify scope changes, etc.

    return {
      scheduleVariance: 0,
      scopeChanges: [],
      milestonesAtRisk: [],
    };
  }
}
