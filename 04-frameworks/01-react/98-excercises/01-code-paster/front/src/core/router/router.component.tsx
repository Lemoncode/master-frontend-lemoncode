import React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { switchRoutes } from './routes';
import { CreateSessionScene, TrainerScene, StudentScene } from 'scenes';

export const RouterComponent: React.FunctionComponent = () => {
  return (
    <Router>
      <Switch>
        <Route
          exact={true}
          path={switchRoutes.root}
          component={CreateSessionScene}
        />
        <Route
          exact={true}
          path={switchRoutes.trainer}
          component={TrainerScene}
        />
        <Route
          exact={true}
          path={switchRoutes.student}
          component={StudentScene}
        />
      </Switch>
    </Router>
  );
};
