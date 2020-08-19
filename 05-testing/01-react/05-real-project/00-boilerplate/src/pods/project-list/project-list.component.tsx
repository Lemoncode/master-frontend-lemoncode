import React from 'react';
import {
  TableContainer,
  RowRendererProps,
  useSearchBar,
} from 'common/components';
import { Project } from './project-list.vm';
import { ProjectRowComponent } from './components';

interface Props {
  projectList: Project[];
  onCreate: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ProjectListComponent: React.FunctionComponent<Props> = ({
  projectList,
  onCreate,
  onEdit,
  onDelete,
}) => {
  const { filteredList, onSearch, search } = useSearchBar(projectList, [
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
      columns={[
        'Activo',
        'Código',
        'Proyecto',
        'Fecha Ultimo incurrido',
        'Fecha creación',
      ]}
      rows={filteredList}
      rowRenderer={(rowProps: RowRendererProps<Project>) => (
        <ProjectRowComponent {...rowProps} />
      )}
      onCreate={onCreate}
      onEdit={onEdit}
      onDelete={onDelete}
      labels={{
        searchPlaceholder: 'Buscar proyecto',
        createButton: 'Nuevo proyecto',
        deleteTitle: 'Eliminar Proyecto',
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
