import React from 'react';
import { hot } from 'react-hot-loader/root';
import { ThemeProviderComponent } from 'core/theme';
import { RouterComponent } from 'core/router';
import { SessionProvider } from 'core/session-context';

const App: React.FunctionComponent = () => {
  return <RouterComponent />;
};

const AppProviders: React.FunctionComponent = () => {
  return (
    <ThemeProviderComponent>
      <SessionProvider>
        <App />
      </SessionProvider>
    </ThemeProviderComponent>
  );
};

export default hot(AppProviders);
