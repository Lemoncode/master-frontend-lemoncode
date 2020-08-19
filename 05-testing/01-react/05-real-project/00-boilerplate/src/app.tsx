import React from 'react';
import { hot } from 'react-hot-loader/root';
import { StylesProvider } from '@material-ui/styles';
import { setValidatorsMessagesToSpanish } from 'core/i18n';
import { RouterComponent } from 'core/router';
import { ThemeProviderComponent } from 'core/theme';
import { AuthProvider } from 'common-app/auth';
import {
  SnackbarComponent,
  SnackbarProvider,
  SpinnerComponent,
} from 'common/components';

setValidatorsMessagesToSpanish();

const App: React.FunctionComponent = () => {
  return (
    <StylesProvider injectFirst>
      <ThemeProviderComponent>
        <AuthProvider>
          <SnackbarProvider>
            <SpinnerComponent />
            <RouterComponent />
            <SnackbarComponent />
          </SnackbarProvider>
        </AuthProvider>
      </ThemeProviderComponent>
    </StylesProvider>
  );
};

export default hot(App);
