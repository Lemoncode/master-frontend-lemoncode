import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { switchRoutes } from './routes';
import { LoginScene, HotelCollectionScene, HotelEditScene } from 'scenes';

export const RouterComponent: React.FunctionComponent = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path={switchRoutes.root} element={<LoginScene />} />
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
