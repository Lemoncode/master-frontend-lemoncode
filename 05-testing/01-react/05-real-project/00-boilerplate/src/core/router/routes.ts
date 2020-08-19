import { generatePath } from 'react-router-dom';

interface BaseRoutes {
  root: string;
  login: string;
  submoduleList: string;
  projects: string;
  editProject: string;
  employees: string;
  editEmployee: string;
}

const baseRoutes: BaseRoutes = {
  root: '/',
  login: '/login',
  submoduleList: '/submodule-list',
  projects: '/projects',
  editProject: '/projects/:id',
  employees: '/employees',
  editEmployee: '/employees/:id',
};

interface Routes extends Omit<BaseRoutes, 'editProject' | 'editEmployee'> {
  editProject: (id?: string) => string;
  editEmployee: (id?: string) => string;
}

export const routes: Routes = {
  ...baseRoutes,
  editProject: id =>
    id ? generatePath(baseRoutes.editProject, { id }) : baseRoutes.editProject,
  editEmployee: id =>
    id
      ? generatePath(baseRoutes.editEmployee, { id })
      : baseRoutes.editEmployee,
};
