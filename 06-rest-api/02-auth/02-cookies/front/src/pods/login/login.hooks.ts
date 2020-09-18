import React from 'react';
import * as api from './api';
import { Login } from './login.vm';
import { useSnackbarContext } from 'common/components';
import { AuthContext } from 'common-app/auth';
import { mapUserSessionFromApiToVm } from './login.mappers';

interface Props {
  onNavigate: () => void;
}
export const useLogin = (props: Props) => {
  const { onChangeUserSession } = React.useContext(AuthContext);
  const { showMessage } = useSnackbarContext();
  const handleLogin = React.useCallback(async (login: Login) => {
    try {
      const apiUserSession = await api.isValidLogin(login.user, login.password);
      const vmUserSession = mapUserSessionFromApiToVm(apiUserSession);
      onChangeUserSession(vmUserSession);
      props.onNavigate();
    } catch (error) {
      error && showMessage('Invalid credentials', 'error');
    }
  }, []);

  return {
    onLogin: handleLogin,
  };
};
