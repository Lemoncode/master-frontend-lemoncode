import { Employee } from './employee-list.api-model';
import { mockEmployeeList } from './employee-list.mock-data';

let employeeList = [...mockEmployeeList];

export const getEmployeeList = async (): Promise<Employee[]> => {
  return employeeList;
};

export const deleteEmployee = async (id: string): Promise<boolean> => {
  employeeList = employeeList.filter(e => e.id !== id);
  return true;
};
