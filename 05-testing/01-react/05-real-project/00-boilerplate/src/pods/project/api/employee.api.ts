import { Project } from './project.api-model';
import { mockProject } from './project.mock-data';

export const getProjectById = async (id: string): Promise<Project> => {
  return mockProject;
};
