import React from 'react';
import { EmployeeListComponent } from './employee-list.component';
import { Employee } from './employee-list.vm';
import { mapEmployeeListFromApiToVm } from './employee-list.mapper';
import { getEmployeeList } from './api';
import { useHistory } from 'react-router-dom';
import { routes } from 'core/router';

export const EmployeeListContainer: React.FunctionComponent = () => {
  const [employees, setEmployees] = React.useState<Employee[]>([]);
  const history = useHistory();

  const onLoadEmployeeList = async () => {
    const apiEmployeeList = await getEmployeeList();
    const viewModelEmployeeList = mapEmployeeListFromApiToVm(apiEmployeeList);
    setEmployees(viewModelEmployeeList);
  };

  React.useEffect(() => {
    onLoadEmployeeList();
  }, []);

  const handleCreate = () => {
    history.push(routes.editEmployee(null));
  };

  const handleEdit = (id: string) => {
    history.push(routes.editEmployee(id));
  };

  const handleDelete = async (id: string) => {
    console.log(`Delete: ${id}`);
  };

  return (
    <>
      <h1>Hello from Employee list POD Container</h1>
      <EmployeeListComponent
        employees={employees}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </>
  );
};
