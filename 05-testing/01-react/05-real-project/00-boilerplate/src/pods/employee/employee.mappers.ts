import { mapToCollection } from 'common/mappers';
import * as apiModel from './api/employee.api-model';
import * as viewModel from './employee.vm';

const mapProjectSummaryFromApiToVm = (
  projectSummary: apiModel.ProjectSummary
): viewModel.ProjectSummary => ({
  ...projectSummary,
});

const mapProjectSummaryListFromApiToVm = (
  projectSummary: apiModel.ProjectSummary[]
): viewModel.ProjectSummary[] =>
  mapToCollection(projectSummary, ps => mapProjectSummaryFromApiToVm(ps));

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
