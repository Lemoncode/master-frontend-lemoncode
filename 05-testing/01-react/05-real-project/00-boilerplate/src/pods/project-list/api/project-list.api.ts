import { Project } from './project-list.api-model';
import { mockProjectList } from './project-list.mock-data';

let projectList = [...mockProjectList];

export const getProjectList = async (): Promise<Project[]> => {
  return projectList;
};

export const deleteProject = async (id: string): Promise<boolean> => {
  projectList = projectList.filter(p => p.id !== id);
  return true;
};
