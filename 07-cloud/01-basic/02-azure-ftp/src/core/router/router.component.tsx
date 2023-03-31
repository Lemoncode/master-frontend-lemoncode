import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { switchRoutes } from './routes';
import { ListScene } from 'scenes';

export const RouterComponent: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path={switchRoutes.root} element={<ListScene />} />
        <Route path={switchRoutes.list} element={<ListScene />} />
      </Routes>
    </HashRouter>
  );
};
