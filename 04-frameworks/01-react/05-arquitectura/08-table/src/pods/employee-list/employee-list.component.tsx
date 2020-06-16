import React from 'react';
import {
  TableContainer,
  RowRendererProps,
  useSearchBar,
} from 'common/components';
import { Employee } from './employee-list.vm';
import { EmployeeRowComponent } from './components';

interface Props {
  employeeList: Employee[];
  onCreate: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const EmployeeListComponent: React.FunctionComponent<Props> = ({
  employeeList,
  onCreate,
  onEdit,
  onDelete,
}) => {
  const { filteredList, onSearch, search } = useSearchBar(employeeList, [
    'name',
  ]);

  const contentRender = ({ itemName }) => {
    return (
      <>
        ¿Seguro que quiere borrar a <strong>{itemName}</strong>?
      </>
    );
  };

  return (
    <TableContainer
      columns={['Activo', 'Id', 'Nombre', 'Email', 'Fecha último incurrido']}
      rows={filteredList}
      rowRenderer={(rowProps: RowRendererProps<Employee>) => (
        <EmployeeRowComponent {...rowProps} />
      )}
      onCreate={onCreate}
      onEdit={onEdit}
      onDelete={onDelete}
      labels={{
        searchPlaceholder: 'Buscar empleado',
        createButton: 'Nuevo empleado',
        deleteTitle: 'Eliminar Empleado',
        deleteContent: props => contentRender(props),
        closeButton: 'Cancelar',
        acceptButton: 'Aceptar',
      }}
      enableSearch={true}
      search={search}
      onSearch={onSearch}
      enablePagination={true}
      pageSize={5}
    />
  );
};
