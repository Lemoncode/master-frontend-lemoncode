import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginScene, HotelCollectionScene, HotelEditScene } from 'scenes';
import { switchRoutes } from './routes';

export const RouterComponent: React.FunctionComponent = () => {
  return (
    <HashRouter>
      <Routes>
        <Route
          path={switchRoutes.root}
          element={<Navigate replace to={switchRoutes.login} />}
        />
        <Route path={switchRoutes.login} element={<LoginScene />} />
        <Route
          path={switchRoutes.hotelCollection}
          element={<HotelCollectionScene />}
        />
        <Route path={switchRoutes.hotelEdit} element={<HotelEditScene />} />
      </Routes>
    </HashRouter>
  );
};
