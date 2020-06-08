import React from 'react';
import { LoginComponent } from './login.component';
import { Login, createEmptyLogin } from './login.vm';
import { isValidLogin } from './login.api';
import { useHistory } from 'react-router-dom';
import { routes } from 'core/router';

export const LoginContainer: React.FunctionComponent = () => {
  const history = useHistory();

  const loginSucceeded = (isValid: boolean): void => {
    if (isValid) {
      history.push(routes.submoduleList);
    } else {
      // TODO replace
      alert('Invalid login');
    }
  };

  const handleLogin = (login: Login) => {
    isValidLogin(login.user, login.password).then(loginSucceeded);
  };

  return (
    <>
      <LoginComponent onLogin={handleLogin} />
    </>
  );
};
