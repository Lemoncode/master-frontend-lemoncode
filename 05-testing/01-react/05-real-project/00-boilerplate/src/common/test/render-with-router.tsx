import React from 'react';
import { render } from '@testing-library/react';
import { HashRouter, Routes } from 'react-router-dom';

export const renderWithRouter = (component, routes) => {
  return {
    ...render(
      <HashRouter>
        <Routes>{routes}</Routes>
        {component}
      </HashRouter>
    ),
  };
};
