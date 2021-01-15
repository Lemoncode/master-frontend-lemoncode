import React from 'react';
import { useHistory } from 'react-router-dom';
import { linkRoutes } from 'core/router';
import { useLogin } from './login.hooks';
import { LoginComponent } from './login.component';

export const LoginContainer: React.FunctionComponent = () => {
  const history = useHistory();
  const { onLogin } = useLogin({
    onNavigate: () => history.push(linkRoutes.list),
  });

  return <LoginComponent onLogin={onLogin} />;
};
