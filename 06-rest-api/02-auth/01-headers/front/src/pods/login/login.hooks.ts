import React from 'react';
import * as api from './api';
import { Login } from './login.vm';
import { AuthContext } from 'common-app/auth';
import { mapUserSessionFromApiToVm } from './login.mappers';

interface Props {
  onNavigate: () => void;
}
export const useLogin = (props: Props) => {
  const { onChangeUserSession } = React.useContext(AuthContext);
  const handleLogin = React.useCallback(async (login: Login) => {
    const apiUserSession = await api.isValidLogin(login.user, login.password);
    const vmUserSession = mapUserSessionFromApiToVm(apiUserSession);
    onChangeUserSession(vmUserSession);
    props.onNavigate();
  }, []);

  return {
    onLogin: handleLogin,
  };
};
