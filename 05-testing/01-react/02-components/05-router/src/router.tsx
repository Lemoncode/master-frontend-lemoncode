import * as React from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';
import { NameCollection } from './name-collection';
import { UserEdit } from './user-edit';

export const Router: React.FunctionComponent = () => {
  return (
    <HashRouter>
      <Switch>
        <Route exact={true} path="/" component={NameCollection} />
        <Route path="/users/:name" component={UserEdit} />
      </Switch>
    </HashRouter>
  );
};
