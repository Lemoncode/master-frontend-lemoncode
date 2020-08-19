import React from 'react';
import { trackPromise } from 'react-promise-tracker';
import { useHistory } from 'react-router-dom';
import { routes } from 'core/router';
import { literals } from 'core/i18n';
import { AuthContext } from 'common-app/auth';
import { useSnackbarContext } from 'common/components';
import { isValidLogin } from './login.api';
import { LoginComponent } from './login.component';
import { Login } from './login.vm';
import { mapLoginResponseToUserSession } from './login.mapper';

export const LoginContainer: React.FunctionComponent = () => {
  const { setUserSession } = React.useContext(AuthContext);
  const { showMessage } = useSnackbarContext();
  const history = useHistory();

  // TODO: Pending to implement with real data
  const loginSucceeded = (isValid: boolean): void => {
    if (isValid) {
      const userSession = mapLoginResponseToUserSession();
      userSession.userName = 'Admin';
      setUserSession(userSession);
      history.push(routes.submoduleList);
    } else {
      showMessage(literals.messages.errors.invalidLogin, 'error');
    }
  };

  const handleLogin = (login: Login) => {
    trackPromise(isValidLogin(login.user, login.password)).then(loginSucceeded);
  };

  return <LoginComponent onLogin={handleLogin} />;
};
