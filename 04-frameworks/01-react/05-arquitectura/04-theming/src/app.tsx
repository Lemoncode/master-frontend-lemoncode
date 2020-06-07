import React from 'react';
import { hot } from 'react-hot-loader/root';
import { RouterComponent } from 'core/router';
import { ThemeProviderComponent } from 'core/theme';

const App: React.FunctionComponent = () => {
  return (
    <ThemeProviderComponent>
      <RouterComponent />
    </ThemeProviderComponent>
  );
};

export default hot(App);
