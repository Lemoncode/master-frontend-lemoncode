import React from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';
import { switchRoutes } from './routes';
import { LoginScene, ListScene } from 'scenes';

export const RouterComponent: React.FunctionComponent = () => {
  return (
    <HashRouter>
      <Switch>
        <Route
          exact={true}
          path={[switchRoutes.root, switchRoutes.login]}
          component={LoginScene}
        />
        <Route exact={true} path={switchRoutes.list} component={ListScene} />
      </Switch>
    </HashRouter>
  );
};
