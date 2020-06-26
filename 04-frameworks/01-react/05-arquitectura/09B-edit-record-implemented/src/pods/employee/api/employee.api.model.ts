export interface Employee {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  temporalPassword?: string;
  projects?: ProjectSummary[];
}

export interface ProjectSummary {
  id: string;
  isAssigned?: boolean;
  projectName: string;
}
