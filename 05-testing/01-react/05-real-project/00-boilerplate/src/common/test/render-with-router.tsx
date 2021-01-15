import React from 'react';
import { render } from '@testing-library/react';
import { HashRouter, Switch } from 'react-router-dom';

export const renderWithRouter = (component, routes) => {
  return {
    ...render(
      <HashRouter>
        <Switch>{routes}</Switch>
        {component}
      </HashRouter>
    ),
  };
};
