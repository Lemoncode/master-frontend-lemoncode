import React from 'react';
import { ProjectComponent } from './project.component';
import { useParams } from 'react-router-dom';
import { useSnackbarContext } from 'common/components';
import { getProjectById } from './api';
import { trackPromise } from 'react-promise-tracker';
import { mapProjectFromApiToVm } from './project.mapper';
import { Project, createEmptyProject } from './project.vm';
import { isEditModeHelper } from 'common/helpers';

export const ProjectContainer: React.FunctionComponent = () => {
  const { id } = useParams();
  const [project, setProject] = React.useState<Project>(createEmptyProject());
  const [isEditMode, setIsEditMode] = React.useState<boolean>(false);
  const { showMessage } = useSnackbarContext();

  const onLoadProject = async () => {
    try {
      const apiProject = await trackPromise(getProjectById(id));
      const viewModelProject = mapProjectFromApiToVm(apiProject);
      setProject(viewModelProject);
    } catch (error) {
      error &&
        showMessage('Ha ocurrido un error al cargar el proyecto', 'error');
    }
  };

  const handleSave = (Project: Project) => {
    console.log('Guardado');
  };

  const handleCancel = () => {
    history.back();
  };

  React.useEffect(() => {
    const isEditMode = isEditModeHelper(id);
    setIsEditMode(isEditMode);
    if (isEditMode) {
      onLoadProject();
    }
  }, []);

  return (
    <ProjectComponent
      isEditMode={isEditMode}
      project={project}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
};
