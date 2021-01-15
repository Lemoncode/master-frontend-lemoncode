import React from 'react';
import { useParams } from 'react-router-dom';
import { EmployeeComponent } from './employee.component';
import { Employee, createEmptyEmployee } from './employee.vm';
import { getEmployeeById } from './api';
import { mapEmployeeFromApiToVm } from './employee.mapper';

export const EmployeeContainer: React.FunctionComponent = () => {
  const { id } = useParams();
  const [employee, setEmployee] = React.useState<Employee>(
    createEmptyEmployee()
  );

  const onLoadEmployee = async () => {
    const apiEmployee = await getEmployeeById(id);
    const viewModelEmployee = mapEmployeeFromApiToVm(apiEmployee);
    setEmployee(viewModelEmployee);
  };

  React.useEffect(() => {
    onLoadEmployee();
  }, []);

  const handleSave = (employee: Employee) => {
    console.log('Guardado');
  };

  const handleCancel = () => {
    history.back();
  };

  return (
    <>
      <h1>{id}</h1>
      <EmployeeComponent
        employee={employee}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </>
  );
};
