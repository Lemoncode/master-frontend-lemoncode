import React from 'react';
import { useHistory } from 'react-router-dom';
import { routes } from 'core/router';
import { AuthContext } from './auth.context';
import { createEmptyUserSession } from './auth.vm';

export const useAuthRedirect = (): { onRedirect: () => void } => {
  const history = useHistory();

  const onRedirect = React.useCallback(() => {
    history.push(routes.login);
  }, []);

  return { onRedirect };
};

export const useLogout = (): { onLogout: () => void } => {
  const { setUserSession } = React.useContext(AuthContext);
  const { onRedirect } = useAuthRedirect();

  const handleLogout = React.useCallback(() => {
    setUserSession(createEmptyUserSession());
    onRedirect();
  }, []);

  return {
    onLogout: handleLogout,
  };
};
