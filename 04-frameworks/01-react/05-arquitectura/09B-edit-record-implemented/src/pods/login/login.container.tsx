import React from 'react';
import { LoginComponent } from './login.component';
import { Login } from './login.vm';
import { isValidLogin } from './login.api';
import { useHistory } from 'react-router-dom';
import { routes } from 'core/router';
import { AuthContext } from 'common-app/auth';

export const LoginContainer: React.FunctionComponent = () => {
  const { setUserSession } = React.useContext(AuthContext);
  const history = useHistory();

  const loginSucceeded = (userName: string, isValid: boolean): void => {
    if (isValid) {
      setUserSession({ userName });
      history.push(routes.submoduleList);
    } else {
      // TODO replace
      alert('Invalid login');
    }
  };

  const handleLogin = (login: Login) => {
    isValidLogin(login.user, login.password).then(result => {
      loginSucceeded(login.user, result);
    });
  };

  return (
    <>
      <LoginComponent onLogin={handleLogin} />
    </>
  );
};
