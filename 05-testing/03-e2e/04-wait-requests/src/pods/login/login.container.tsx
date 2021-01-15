import React from 'react';
import { useHistory } from 'react-router-dom';
import { SessionContext } from 'core/session-context';
import { linkRoutes } from 'core/router';
import * as api from './api';
import { LoginComponent } from './login.component';
import { Login } from './login.vm';

interface Props {
  className?: string;
}

export const LoginContainer: React.FunctionComponent<Props> = (props) => {
  const { className } = props;
  const { updateLogin } = React.useContext(SessionContext);
  const history = useHistory();

  const handleLogin = async (login: Login) => {
    const isValid = await api.isValidLogin(login.name, login.password);

    if (isValid) {
      updateLogin(login.name);
      history.push(linkRoutes.hotelCollection);
    } else {
      alert(
        'invalid credentials, use admin/test, excercise: display a mui snackbar instead of this alert.'
      );
    }
  };
  return <LoginComponent className={className} onLogin={handleLogin} />;
};
