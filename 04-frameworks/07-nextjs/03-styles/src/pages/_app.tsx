import React from 'react';
import { AppProps } from 'next/app';
import { ThemeProvider } from '../common/theme';

const App: React.FC<AppProps> = (props) => {
  const { Component, pageProps } = props;

  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
};

export default App;
