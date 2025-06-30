// Solar Project Template Service
// Implements the Master Project Schedule template from MASTER_PLAN_OF_PROJECT.md

import {
  ProjectEntity,
  Phase,
  Activity,
  CreateProjectRequest,
  CreatePhaseRequest,
  CreateActivityRequest,
  SolarProjectTemplate,
  DependencyType,
  TaskDependency,
} from "../types/project-management";

/**
 * Solar Project Template Service
 * Creates standardized solar installation projects based on the master plan
 */
export class SolarProjectTemplateService {
  /**
   * Solar Project Master Template
   * Based on the "Solar Rooftop Power Generation Management Project 1"
   */
  private static readonly SOLAR_PROJECT_TEMPLATE: SolarProjectTemplate = {
    phases: {
      planning: {
        name: "Planning & Permitting",
        weight: 0.15,
        activities: [
          "Kick-off & Scope Verification",
          "Detailed Survey & Site Assessment",
          "Engineering Design Approval by PWA",
          "Building Modification Permit",
          "Electrical Installation Permit",
          "Environmental Impact Assessment",
          "Grid Connection Application",
        ],
      },
      procurement: {
        name: "Procurement & Logistics",
        weight: 0.1,
        activities: [
          "PV Module Procurement",
          "Inverter System Procurement",
          "Electrical Components Procurement",
          "Mounting System Procurement",
          "Delivery Coordination",
          "Quality Inspection of Materials",
        ],
      },
      construction: {
        name: "Construction & Installation",
        weight: 0.65,
        activities: [
          "Work on Clear Water Tank Roof 1",
          "Work on Clear Water Tank Roof 2",
          "Work on Administration Building Roof",
          "Work on Carport Roof",
          "DC Electrical System Installation",
          "AC Electrical System Installation",
          "Complete DC and AC Electrical System Interconnection",
          "Safety System Installation",
          "Monitoring System Setup",
        ],
      },
      testing: {
        name: "Testing & Handover",
        weight: 0.1,
        activities: [
          "Pre-Commissioning Test",
          "Commissioning Test",
          "Performance Testing",
          "Safety Testing",
          "Grid Connection Testing",
          "Documentation & Handover",
          "Training & Knowledge Transfer",
          "Warranty Registration",
        ],
      },
    },
  };

  /**
   * Create a new solar project from template
   */
  static createSolarProject(request: {
    projectName: string;
    projectOwner: string;
    mainContractor: string;
    plannedStartDate: Date;
    plannedEndDate: Date;
    systemCapacityKw: number;
    location: string;
  }): CreateProjectRequest {
    const totalDurationDays = Math.ceil(
      (request.plannedEndDate.getTime() - request.plannedStartDate.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    const phases: CreatePhaseRequest[] = [];
    let currentStartDate = new Date(request.plannedStartDate);

    // Create Planning & Permitting Phase (15% of timeline)
    const planningDuration = Math.ceil(totalDurationDays * 0.15);
    const planningEndDate = new Date(
      currentStartDate.getTime() + planningDuration * 24 * 60 * 60 * 1000
    );

    phases.push({
      phaseName: this.SOLAR_PROJECT_TEMPLATE.phases.planning.name,
      weight: this.SOLAR_PROJECT_TEMPLATE.phases.planning.weight,
      startDate: new Date(currentStartDate),
      endDate: planningEndDate,
      activities: this.createPlanningActivities(
        currentStartDate,
        planningEndDate
      ),
    });

    currentStartDate = new Date(planningEndDate);

    // Create Procurement & Logistics Phase (10% of timeline)
    const procurementDuration = Math.ceil(totalDurationDays * 0.1);
    const procurementEndDate = new Date(
      currentStartDate.getTime() + procurementDuration * 24 * 60 * 60 * 1000
    );

    phases.push({
      phaseName: this.SOLAR_PROJECT_TEMPLATE.phases.procurement.name,
      weight: this.SOLAR_PROJECT_TEMPLATE.phases.procurement.weight,
      startDate: new Date(currentStartDate),
      endDate: procurementEndDate,
      activities: this.createProcurementActivities(
        currentStartDate,
        procurementEndDate
      ),
    });

    currentStartDate = new Date(procurementEndDate);

    // Create Construction & Installation Phase (65% of timeline)
    const constructionDuration = Math.ceil(totalDurationDays * 0.65);
    const constructionEndDate = new Date(
      currentStartDate.getTime() + constructionDuration * 24 * 60 * 60 * 1000
    );

    phases.push({
      phaseName: this.SOLAR_PROJECT_TEMPLATE.phases.construction.name,
      weight: this.SOLAR_PROJECT_TEMPLATE.phases.construction.weight,
      startDate: new Date(currentStartDate),
      endDate: constructionEndDate,
      activities: this.createConstructionActivities(
        currentStartDate,
        constructionEndDate
      ),
    });

    currentStartDate = new Date(constructionEndDate);

    // Create Testing & Handover Phase (10% of timeline)
    const testingDuration = Math.ceil(totalDurationDays * 0.1);
    const testingEndDate = new Date(
      currentStartDate.getTime() + testingDuration * 24 * 60 * 60 * 1000
    );

    phases.push({
      phaseName: this.SOLAR_PROJECT_TEMPLATE.phases.testing.name,
      weight: this.SOLAR_PROJECT_TEMPLATE.phases.testing.weight,
      startDate: new Date(currentStartDate),
      endDate: testingEndDate,
      activities: this.createTestingActivities(
        currentStartDate,
        testingEndDate
      ),
    });

    return {
      projectName: request.projectName,
      projectOwner: request.projectOwner,
      mainContractor: request.mainContractor,
      plannedStartDate: request.plannedStartDate,
      plannedEndDate: request.plannedEndDate,
      phases,
    };
  }

  /**
   * Create Planning & Permitting activities
   */
  private static createPlanningActivities(
    phaseStart: Date,
    phaseEnd: Date
  ): CreateActivityRequest[] {
    const activities = this.SOLAR_PROJECT_TEMPLATE.phases.planning.activities;
    const phaseDuration = Math.ceil(
      (phaseEnd.getTime() - phaseStart.getTime()) / (1000 * 60 * 60 * 24)
    );
    const activityDuration = Math.ceil(phaseDuration / activities.length);

    return activities.map((activityName, index) => {
      const startDate = new Date(
        phaseStart.getTime() + index * activityDuration * 24 * 60 * 60 * 1000
      );
      const endDate = new Date(
        startDate.getTime() + activityDuration * 24 * 60 * 60 * 1000
      );

      // Ensure last activity ends exactly at phase end
      if (index === activities.length - 1) {
        endDate.setTime(phaseEnd.getTime());
      }

      return {
        activityName,
        duration: activityDuration,
        startDate,
        endDate,
        assignedResources: this.getDefaultResourcesForActivity(activityName),
      };
    });
  }

  /**
   * Create Procurement & Logistics activities
   */
  private static createProcurementActivities(
    phaseStart: Date,
    phaseEnd: Date
  ): CreateActivityRequest[] {
    const activities =
      this.SOLAR_PROJECT_TEMPLATE.phases.procurement.activities;
    const phaseDuration = Math.ceil(
      (phaseEnd.getTime() - phaseStart.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Procurement activities can run in parallel, so give each the full duration
    return activities.map((activityName) => ({
      activityName,
      duration: phaseDuration,
      startDate: new Date(phaseStart),
      endDate: new Date(phaseEnd),
      assignedResources: this.getDefaultResourcesForActivity(activityName),
    }));
  }

  /**
   * Create Construction & Installation activities
   */
  private static createConstructionActivities(
    phaseStart: Date,
    phaseEnd: Date
  ): CreateActivityRequest[] {
    const activities =
      this.SOLAR_PROJECT_TEMPLATE.phases.construction.activities;
    const phaseDuration = Math.ceil(
      (phaseEnd.getTime() - phaseStart.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Construction activities have complex dependencies and parallel execution
    const constructionActivities: CreateActivityRequest[] = [];

    // Roof work activities (can run in parallel)
    const roofActivities = activities.slice(0, 4); // First 4 are roof work
    const roofDuration = Math.ceil(phaseDuration * 0.6); // 60% of construction phase

    roofActivities.forEach((activityName) => {
      constructionActivities.push({
        activityName,
        duration: roofDuration,
        startDate: new Date(phaseStart),
        endDate: new Date(
          phaseStart.getTime() + roofDuration * 24 * 60 * 60 * 1000
        ),
        assignedResources: [
          "installation-crew-1",
          "crane-1",
          "safety-supervisor",
        ],
      });
    });

    // Electrical activities (sequential after roof work)
    const electricalStart = new Date(
      phaseStart.getTime() + roofDuration * 24 * 60 * 60 * 1000
    );
    const electricalActivities = activities.slice(4); // Remaining activities
    const electricalDuration = phaseDuration - roofDuration;
    const electricalActivityDuration = Math.ceil(
      electricalDuration / electricalActivities.length
    );

    electricalActivities.forEach((activityName, index) => {
      const startDate = new Date(
        electricalStart.getTime() +
          index * electricalActivityDuration * 24 * 60 * 60 * 1000
      );
      const endDate = new Date(
        startDate.getTime() + electricalActivityDuration * 24 * 60 * 60 * 1000
      );

      // Ensure last activity ends exactly at phase end
      if (index === electricalActivities.length - 1) {
        endDate.setTime(phaseEnd.getTime());
      }

      constructionActivities.push({
        activityName,
        duration: electricalActivityDuration,
        startDate,
        endDate,
        assignedResources: ["electrical-team-1", "electrician-supervisor"],
      });
    });

    return constructionActivities;
  }

  /**
   * Create Testing & Handover activities
   */
  private static createTestingActivities(
    phaseStart: Date,
    phaseEnd: Date
  ): CreateActivityRequest[] {
    const activities = this.SOLAR_PROJECT_TEMPLATE.phases.testing.activities;
    const phaseDuration = Math.ceil(
      (phaseEnd.getTime() - phaseStart.getTime()) / (1000 * 60 * 60 * 24)
    );
    const activityDuration = Math.ceil(phaseDuration / activities.length);

    return activities.map((activityName, index) => {
      const startDate = new Date(
        phaseStart.getTime() + index * activityDuration * 24 * 60 * 60 * 1000
      );
      const endDate = new Date(
        startDate.getTime() + activityDuration * 24 * 60 * 60 * 1000
      );

      // Ensure last activity ends exactly at phase end
      if (index === activities.length - 1) {
        endDate.setTime(phaseEnd.getTime());
      }

      return {
        activityName,
        duration: activityDuration,
        startDate,
        endDate,
        assignedResources: this.getDefaultResourcesForActivity(activityName),
      };
    });
  }

  /**
   * Get default resources for an activity based on its name
   */
  private static getDefaultResourcesForActivity(
    activityName: string
  ): string[] {
    const activityResourceMap: Record<string, string[]> = {
      // Planning activities
      "Kick-off & Scope Verification": [
        "project-manager",
        "client-representative",
      ],
      "Detailed Survey & Site Assessment": ["surveyor", "engineer"],
      "Engineering Design Approval by PWA": ["design-engineer", "pwa-liaison"],
      "Building Modification Permit": ["permit-specialist"],
      "Electrical Installation Permit": [
        "electrical-engineer",
        "permit-specialist",
      ],
      "Environmental Impact Assessment": ["environmental-consultant"],
      "Grid Connection Application": ["grid-connection-specialist"],

      // Procurement activities
      "PV Module Procurement": ["procurement-manager"],
      "Inverter System Procurement": [
        "procurement-manager",
        "electrical-engineer",
      ],
      "Electrical Components Procurement": ["procurement-manager"],
      "Mounting System Procurement": [
        "procurement-manager",
        "structural-engineer",
      ],
      "Delivery Coordination": ["logistics-coordinator"],
      "Quality Inspection of Materials": ["quality-inspector"],

      // Construction activities
      "Work on Clear Water Tank Roof 1": [
        "installation-crew-1",
        "crane-1",
        "safety-supervisor",
      ],
      "Work on Clear Water Tank Roof 2": [
        "installation-crew-2",
        "crane-1",
        "safety-supervisor",
      ],
      "Work on Administration Building Roof": [
        "installation-crew-1",
        "crane-1",
        "safety-supervisor",
      ],
      "Work on Carport Roof": [
        "installation-crew-2",
        "crane-1",
        "safety-supervisor",
      ],
      "DC Electrical System Installation": [
        "electrical-team-1",
        "electrician-supervisor",
      ],
      "AC Electrical System Installation": [
        "electrical-team-1",
        "electrician-supervisor",
      ],
      "Complete DC and AC Electrical System Interconnection": [
        "electrical-team-1",
        "electrical-engineer",
      ],
      "Safety System Installation": ["safety-specialist", "electrical-team-1"],
      "Monitoring System Setup": ["monitoring-specialist", "it-technician"],

      // Testing activities
      "Pre-Commissioning Test": ["commissioning-engineer", "electrical-team-1"],
      "Commissioning Test": ["commissioning-engineer", "quality-inspector"],
      "Performance Testing": ["performance-analyst", "commissioning-engineer"],
      "Safety Testing": ["safety-inspector", "electrical-team-1"],
      "Grid Connection Testing": [
        "grid-connection-specialist",
        "electrical-engineer",
      ],
      "Documentation & Handover": [
        "project-manager",
        "documentation-specialist",
      ],
      "Training & Knowledge Transfer": [
        "training-specialist",
        "operations-manager",
      ],
      "Warranty Registration": ["warranty-specialist", "project-manager"],
    };

    return activityResourceMap[activityName] || ["general-contractor"];
  }

  /**
   * Create standard task dependencies for solar projects
   */
  static createStandardDependencies(phases: Phase[]): TaskDependency[] {
    const dependencies: TaskDependency[] = [];
    const activityMap = new Map<string, Activity>();

    // Build activity map for easy lookup
    phases.forEach((phase) => {
      phase.activities.forEach((activity) => {
        activityMap.set(activity.activityName, activity);
      });
    });

    // Phase-level dependencies (FS - Finish to Start)
    for (let i = 0; i < phases.length - 1; i++) {
      const currentPhase = phases[i];
      const nextPhase = phases[i + 1];

      // Last activity of current phase must finish before first activity of next phase
      const lastActivity =
        currentPhase.activities[currentPhase.activities.length - 1];
      const firstActivity = nextPhase.activities[0];

      dependencies.push({
        dependencyId: `dep-${lastActivity.activityId}-${firstActivity.activityId}`,
        predecessorId: lastActivity.activityId,
        successorId: firstActivity.activityId,
        dependencyType: DependencyType.FINISH_TO_START,
        lagTime: 0,
      });
    }

    // Activity-specific dependencies within construction phase
    const constructionPhase = phases.find((p) =>
      p.phaseName.includes("Construction")
    );
    if (constructionPhase) {
      const roofWork = constructionPhase.activities.filter((a) =>
        a.activityName.includes("Roof")
      );
      const dcInstall = constructionPhase.activities.find((a) =>
        a.activityName.includes("DC Electrical")
      );
      const acInstall = constructionPhase.activities.find((a) =>
        a.activityName.includes("AC Electrical")
      );
      const interconnection = constructionPhase.activities.find((a) =>
        a.activityName.includes("Interconnection")
      );

      // DC installation depends on roof work completion
      if (roofWork.length > 0 && dcInstall) {
        roofWork.forEach((roofActivity) => {
          dependencies.push({
            dependencyId: `dep-${roofActivity.activityId}-${dcInstall.activityId}`,
            predecessorId: roofActivity.activityId,
            successorId: dcInstall.activityId,
            dependencyType: DependencyType.FINISH_TO_START,
            lagTime: 0,
          });
        });
      }

      // AC installation depends on DC installation
      if (dcInstall && acInstall) {
        dependencies.push({
          dependencyId: `dep-${dcInstall.activityId}-${acInstall.activityId}`,
          predecessorId: dcInstall.activityId,
          successorId: acInstall.activityId,
          dependencyType: DependencyType.FINISH_TO_START,
          lagTime: 0,
        });
      }

      // Interconnection depends on both DC and AC (FF - Finish to Finish)
      if (dcInstall && acInstall && interconnection) {
        dependencies.push({
          dependencyId: `dep-${dcInstall.activityId}-${interconnection.activityId}`,
          predecessorId: dcInstall.activityId,
          successorId: interconnection.activityId,
          dependencyType: DependencyType.FINISH_TO_FINISH,
          lagTime: 0,
        });

        dependencies.push({
          dependencyId: `dep-${acInstall.activityId}-${interconnection.activityId}`,
          predecessorId: acInstall.activityId,
          successorId: interconnection.activityId,
          dependencyType: DependencyType.FINISH_TO_FINISH,
          lagTime: 0,
        });
      }
    }

    return dependencies;
  }

  /**
   * Calculate estimated project duration based on system capacity
   */
  static estimateProjectDuration(systemCapacityKw: number): number {
    // Base duration for small systems (100kW) is 120 days
    // Scale linearly with capacity
    const baseDuration = 120;
    const scaleFactor = systemCapacityKw / 100;

    return Math.ceil(baseDuration * Math.max(0.5, scaleFactor));
  }

  /**
   * Get recommended resources based on project size
   */
  static getRecommendedResources(systemCapacityKw: number): string[] {
    const baseResources = [
      "project-manager",
      "site-supervisor",
      "safety-supervisor",
      "quality-inspector",
    ];

    if (systemCapacityKw > 500) {
      baseResources.push(
        "installation-crew-1",
        "installation-crew-2",
        "electrical-team-1",
        "electrical-team-2",
        "crane-1",
        "crane-2"
      );
    } else {
      baseResources.push("installation-crew-1", "electrical-team-1", "crane-1");
    }

    return baseResources;
  }
}
