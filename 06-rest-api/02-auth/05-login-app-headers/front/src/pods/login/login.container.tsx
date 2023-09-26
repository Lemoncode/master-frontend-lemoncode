import React from 'react';
import { useNavigate } from 'react-router-dom';
import { linkRoutes } from 'core/router';
import { useLogin } from './login.hooks';
import { LoginComponent } from './login.component';

export const LoginContainer: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const { onLogin } = useLogin({
    onNavigate: () => navigate(linkRoutes.list),
  });

  return <LoginComponent onLogin={onLogin} />;
};
