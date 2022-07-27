import React from 'react';
import { AppProps } from 'next/app';
import { ThemeProviderComponent } from 'core/theme';
import { UserProvider } from '../common/contexts';

const App: React.FunctionComponent<AppProps> = (props) => {
  const { Component, pageProps } = props;

  return (
    <ThemeProviderComponent>
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </ThemeProviderComponent>
  );
};

export default App;
