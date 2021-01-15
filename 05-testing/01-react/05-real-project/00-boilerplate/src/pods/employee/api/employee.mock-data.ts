import { Employee, ProjectSummary } from './employee.api-model';

const mockProjectSummaryList: ProjectSummary[] = [
  {
    id: '1',
    isAssigned: true,
    projectName: 'Mapfre',
  },
  {
    id: '2',
    isAssigned: false,
    projectName: 'Bankia',
  },
  {
    id: '3',
    isAssigned: false,
    projectName: 'Vacaciones',
  },
  {
    id: '4',
    isAssigned: true,
    projectName: 'Baja',
  },
];

export const mockEmployee: Employee = {
  id: '1',
  name: 'Prueba Nombre',
  email: 'prueba@email.com',
  isActive: true,
  temporalPassword: 'admin',
  projects: mockProjectSummaryList,
};
