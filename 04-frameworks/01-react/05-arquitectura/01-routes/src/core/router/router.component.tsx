import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { switchRoutes } from './routes';
import {
  LoginScene,
  SubmoduleListScene,
  EmployeeListScene,
  EmployeeScene,
} from 'scenes';

export const RouterComponent: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path={switchRoutes.root} element={<LoginScene />} />
        <Route path={switchRoutes.login} element={<LoginScene />} />
        <Route
          path={switchRoutes.submoduleList}
          element={<SubmoduleListScene />}
        />
        <Route path={switchRoutes.employees} element={<EmployeeListScene />} />
        <Route path={switchRoutes.editEmployee} element={<EmployeeScene />} />
      </Routes>
    </HashRouter>
  );
};
