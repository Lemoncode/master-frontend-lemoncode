import React from 'react';
import { useNavigate } from 'react-router-dom';
import { EmployeeListComponent } from './employee-list.component';
import { getEmployeeList, deleteEmployee } from './api';
import { Employee } from './employee-list.vm';
import { useSnackbarContext } from 'common/components';
import { trackPromise } from 'react-promise-tracker';
import { mapEmployeeListFromApiToVm } from './employee-list.mappers';
import { routes } from 'core/router';
const editEmployeeId = '0';

export const EmployeeListContainer: React.FunctionComponent = () => {
  const [employees, setEmployees] = React.useState<Employee[]>([]);
  const { showMessage } = useSnackbarContext();
  const navigate = useNavigate();

  const onLoadEmployeeList = async () => {
    try {
      const apiEmployeeList = await trackPromise(getEmployeeList());
      const viewModelEmloyeeList = mapEmployeeListFromApiToVm(apiEmployeeList);
      setEmployees(viewModelEmloyeeList);
    } catch (error) {
      error &&
        showMessage('Ha ocurrido un error al cargar los empleados', 'error');
    }
  };

  const handleCreate = () => {
    navigate(routes.editEmployee(editEmployeeId));
  };

  const handleEdit = (id: string) => {
    navigate(routes.editEmployee(id));
  };

  const handleDelete = async (id: string) => {
    const errorMessage = 'Error al eliminar un empleado';
    try {
      const isDeleted = await trackPromise(deleteEmployee(id));
      isDeleted ? onLoadEmployeeList() : showMessage(errorMessage, 'error');
    } catch (error) {
      error && showMessage(errorMessage, 'error');
    }
  };

  React.useEffect(() => {
    onLoadEmployeeList();
  }, []);

  return (
    <EmployeeListComponent
      employeeList={employees}
      onCreate={handleCreate}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
};
