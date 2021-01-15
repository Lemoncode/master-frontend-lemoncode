export interface Employee {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  temporalPassword?: string;
  projects: ProjectSummary[];
}

export interface ProjectSummary {
  id: string;
  isAssigned?: boolean;
  projectName: string;
}

export interface Report {
  month: string;
  year: string;
}

export const createEmptyEmployee = (): Employee => ({
  id: '',
  name: '',
  email: '',
  isActive: false,
  temporalPassword: '',
  projects: [],
});

export const createEmptyReport = (): Report => ({
  month: '',
  year: '',
});
