import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthRoute } from 'common-app/auth';
import { routes } from './routes';
import {
  LoginScene,
  SubmoduleListScene,
  ProjectListScene,
  EmployeeListScene,
  ProjectScene,
  EmployeeScene,
} from 'scenes';

export const RouterComponent: React.FunctionComponent = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path={routes.root} element={<LoginScene />} />
        <Route path={routes.login} element={<LoginScene />} />
        <Route
          path={routes.submoduleList}
          element={<AuthRoute>
            <SubmoduleListScene />
          </AuthRoute>}
        />
        <Route path={routes.projects} element={<ProjectListScene />} />
        <Route path={routes.employees} element={<EmployeeListScene />} />
        <Route path={routes.editProject()} element={<ProjectScene />} />
        <Route path={routes.editEmployee()} element={<EmployeeScene />} />
      </Routes>
    </HashRouter>
  );
};
