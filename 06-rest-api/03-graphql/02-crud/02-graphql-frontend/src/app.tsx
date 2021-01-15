import React from 'react';
import { hot } from 'react-hot-loader/root';
import { ThemeProviderComponent } from 'core/theme';
import { RouterComponent } from 'core/router';

const App: React.FunctionComponent = () => {
  return <RouterComponent />;
};

const AppProviders: React.FunctionComponent = () => {
  return (
    <ThemeProviderComponent>
      <App />
    </ThemeProviderComponent>
  );
};

export default hot(AppProviders);
