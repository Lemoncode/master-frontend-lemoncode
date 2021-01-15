import * as apiModel from './api/employee-list.api-model';
import * as viewModel from './employee-list.vm';

const mapEmployeeFromApiToVm = (
  employee: apiModel.Employee
): viewModel.Employee => ({
  ...employee,
});

export const mapEmployeeListFromApiToVm = (
  employeeList: apiModel.Employee[]
): viewModel.Employee[] => employeeList.map(e => mapEmployeeFromApiToVm(e));
