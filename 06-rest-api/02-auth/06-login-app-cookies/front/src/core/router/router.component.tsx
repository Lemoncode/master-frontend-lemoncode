import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { switchRoutes } from './routes';
import { LoginScene, ListScene } from 'scenes';

export const RouterComponent: React.FunctionComponent = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path={switchRoutes.login} element={<LoginScene />} />
        <Route path={switchRoutes.list} element={<ListScene />} />
        <Route
          path={switchRoutes.root}
          element={<Navigate to={switchRoutes.login} />}
        />
      </Routes>
    </HashRouter>
  );
};
