export interface Project {
  id: string;
  name: string;
  externalId?: string;
  comments?: string;
  isActive: boolean;
  employees: EmployeeSummary[];
}

export interface EmployeeSummary {
  id: string;
  isAssigned?: boolean;
  employeeName: string;
}

export const createEmptyProject = (): Project => ({
  id: '',
  name: '',
  externalId: '',
  comments: '',
  isActive: false,
  employees: [],
});
