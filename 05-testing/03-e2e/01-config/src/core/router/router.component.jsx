import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';

import { history } from './history';
import { routes } from './routes';
import { LoginScene, HotelCollectionScene, HotelEditScene } from 'scenes';
import { AppLayout } from '../../layouts/app.layout';

export const RouterComponent = () => {
  return (
    <AppLayout>
      <ConnectedRouter history={history}>
        <Switch>
          <Route
            exact={true}
            path={[routes.root, routes.login]}
            component={LoginScene}
          />
          <Route
            exact={true}
            path={routes.hotelCollection}
            component={HotelCollectionScene}
          />
          <Route path={routes.hotelEdit} component={HotelEditScene} />
        </Switch>
      </ConnectedRouter>
    </AppLayout>
  );
};
