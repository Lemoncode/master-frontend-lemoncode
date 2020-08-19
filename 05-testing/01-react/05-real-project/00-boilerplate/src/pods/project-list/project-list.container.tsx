import React from 'react';
import { ProjectListComponent } from './project-list.component';
import { getProjectList, deleteProject } from './api';
import { Project } from './project-list.vm';
import { useSnackbarContext } from 'common/components';
import { trackPromise } from 'react-promise-tracker';
import { mapProjectListFromApiToVm } from './project-list.mappers';
import { routes } from 'core/router';
import { useHistory } from 'react-router-dom';
const editProjectId = '0';

export const ProjectListContainer: React.FunctionComponent = () => {
  const [projects, setProjects] = React.useState<Project[]>([]);
  const { showMessage } = useSnackbarContext();
  const history = useHistory();

  const onLoadProjectList = async () => {
    try {
      const apiProjectList = await trackPromise(getProjectList());
      const viewModelProjectList = mapProjectListFromApiToVm(apiProjectList);
      setProjects(viewModelProjectList);
    } catch (error) {
      error &&
        showMessage('Ha ocurrido un error al cargar los proyectos', 'error');
    }
  };

  const handleCreate = () => {
    history.push(routes.editProject(editProjectId));
  };

  const handleEdit = (id: string) => {
    history.push(routes.editProject(id));
  };

  const handleDelete = async (id: string) => {
    const errorMessage = 'Error al eliminar un proyecto';
    try {
      const isDeleted = await trackPromise(deleteProject(id));
      isDeleted ? onLoadProjectList() : showMessage(errorMessage, 'error');
    } catch (error) {
      error && showMessage(errorMessage, 'error');
    }
  };

  React.useEffect(() => {
    onLoadProjectList();
  }, []);

  return (
    <ProjectListComponent
      projectList={projects}
      onCreate={handleCreate}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
};
