import React from 'react';
import { CardComponent, LoginFormComponent } from './components';
import { Login } from './login.vm';

interface Props {
  onLogin: (login: Login) => void;
  className?: string;
}

export const LoginComponent: React.FunctionComponent<Props> = (props) => {
  const { onLogin } = props;
  return (
    <CardComponent title="Login">
      <LoginFormComponent onLogin={onLogin} />
    </CardComponent>
  );
};
