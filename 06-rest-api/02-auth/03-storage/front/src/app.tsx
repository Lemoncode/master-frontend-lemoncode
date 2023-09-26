import React from 'react';
import { RouterComponent } from 'core/router';
import { ThemeProviderComponent } from 'core/theme';
import { SnackbarProvider, SnackbarComponent } from 'common/components';
import { AuthProviderComponent } from 'common-app/auth';

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
