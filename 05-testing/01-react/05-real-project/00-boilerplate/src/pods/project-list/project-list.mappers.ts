import { mapToCollection } from 'common/mappers';
import * as apiModel from './api/project-list.api-model';
import * as viewModel from './project-list.vm';

const mapProjectFromApiToVm = (
  project: apiModel.Project
): viewModel.Project => ({
  ...project,
});

export const mapProjectListFromApiToVm = (
  projectList: apiModel.Project[]
): viewModel.Project[] =>
  mapToCollection(projectList, p => mapProjectFromApiToVm(p));
