import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginScene, ListScene } from '#scenes';
import { switchRoutes } from './routes';

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
