import React from 'react';
import { SnackbarProvider, SnackbarComponent } from '#common/components';
import { RouterComponent } from '#core/router';
import { ThemeProviderComponent } from '#core/theme';
import { AuthProviderComponent } from '#core/auth';
import { restoreHeader, headerConstants } from '#core/api';

restoreHeader(headerConstants.authorization);

const App: React.FunctionComponent = () => {
  return (
    <ThemeProviderComponent>
      <SnackbarProvider>
        <AuthProviderComponent>
          <RouterComponent />
          <SnackbarComponent />
        </AuthProviderComponent>
      </SnackbarProvider>
    </ThemeProviderComponent>
  );
};

export default App;
