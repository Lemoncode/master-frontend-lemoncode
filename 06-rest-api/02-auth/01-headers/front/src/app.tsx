import React from 'react';
import { hot } from 'react-hot-loader/root';
import { RouterComponent } from 'core/router';
import { ThemeProviderComponent } from 'core/theme';
import { AuthProviderComponent } from 'common-app/auth';

const App: React.FunctionComponent = () => {
  return (
    <ThemeProviderComponent>
      <AuthProviderComponent>
        <RouterComponent />
      </AuthProviderComponent>
    </ThemeProviderComponent>
  );
};

export default hot(App);
