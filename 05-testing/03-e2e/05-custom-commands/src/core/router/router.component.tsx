import React from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';
import { switchRoutes } from './routes';
import { LoginScene, HotelCollectionScene, HotelEditScene } from 'scenes';

export const RouterComponent: React.FunctionComponent = () => {
  return (
    <HashRouter>
      <Switch>
        <Route
          exact={true}
          path={[switchRoutes.root, switchRoutes.login]}
          component={LoginScene}
        />
        <Route
          path={switchRoutes.hotelCollection}
          component={HotelCollectionScene}
        />
        <Route
          path={switchRoutes.hotelEdit}
          component={HotelEditScene}
        />
      </Switch>
    </HashRouter>
  );
};
