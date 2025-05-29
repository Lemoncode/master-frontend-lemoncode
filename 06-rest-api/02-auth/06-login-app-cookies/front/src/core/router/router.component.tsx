import React from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router';
import { AuthContext } from '#core/auth';
import { useApiConfig } from '#core/api';
import { LoginScene, ListScene } from '#scenes';
import { switchRoutes, linkRoutes } from './routes';

export const RouterComponent: React.FC = () => {
  return (
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  );
};

const PrivateRoutes = () => {
  const { userSession } = React.useContext(AuthContext);
  return userSession?.userName ? (
    <Outlet />
  ) : (
    <Navigate to={linkRoutes.login} />
  );
};

const AppRoutes: React.FC = () => {
  useApiConfig();
  return (
    <Routes>
      <Route path={switchRoutes.login} element={<LoginScene />} />
      <Route element={<PrivateRoutes />}>
        <Route path={switchRoutes.list} element={<ListScene />} />
      </Route>
      <Route
        path={switchRoutes.root}
        element={<Navigate to={switchRoutes.login} />}
      />
    </Routes>
  );
};
