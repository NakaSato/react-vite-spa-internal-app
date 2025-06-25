export interface Project {
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

export interface NewProjectForm {
  projectName: string;
  address: string;
  clientInfo: string;
  status: Project["status"];
  startDate: string;
  estimatedEndDate: string;
  totalCapacityKw: number;
  pvModuleCount: number;
  ftsValue: number;
  revenueValue: number;
  pqmValue: number;
  inverter125Kw: number;
  inverter80Kw: number;
  inverter60Kw: number;
  inverter40Kw: number;
  latitude: number;
  longitude: number;
  connectionType: "LV" | "MV" | "HV";
  connectionNotes: string;
}

export type TabType = "overview" | "projects" | "construction" | "reports";
