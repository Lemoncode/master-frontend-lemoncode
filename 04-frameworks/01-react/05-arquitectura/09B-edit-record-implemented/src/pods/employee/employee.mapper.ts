import * as apiModel from './api/employee.api.model';
import * as viewModel from './employee.vm';

const mapProjectSummaryFromApiToVm = (
  projectSummary: apiModel.ProjectSummary
): viewModel.ProjectSummary => ({
  ...projectSummary,
});

const mapProjectSummaryListFromApiToVm = (
  projectSummaryCollection: apiModel.ProjectSummary[]
): viewModel.ProjectSummary[] =>
  projectSummaryCollection.map(mapProjectSummaryFromApiToVm);

export const mapEmployeeFromApiToVm = (
  employee: apiModel.Employee
): viewModel.Employee => {
  return Boolean(employee)
    ? {
        ...employee,
        projects: mapProjectSummaryListFromApiToVm(employee.projects),
      }
    : viewModel.createEmptyEmployee();
};
