import React from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import { MicroappLoader, routes } from "./core";
import { Dashboard } from "./pods/dashboard";
import { AppFrame } from "./pods/app-frame";

export const AppRouter: React.FC = () => {
  return (
    <HashRouter>
      <AppFrame>
        <Switch>
          <Route exact path={routes.home}>
            <Dashboard />
          </Route>
          <Route exact path={routes.clock}>
            <MicroappLoader microapp="clock" />
          </Route>
          <Route exact path={routes.quote}>
            <MicroappLoader microapp="quote" />
          </Route>
        </Switch>
      </AppFrame>
    </HashRouter>
  );
};
