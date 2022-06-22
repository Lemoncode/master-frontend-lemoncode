import React from 'react';
import { Route, RouteProps, useLocation } from 'react-router-dom';
import { AuthContext } from './auth.context';
import { useAuthRedirect } from './auth.hooks';

interface Props {
  children: React.ReactNode;
}

export const AuthRoute: React.FC<Props> = (props) => {
  const { children } = props;
  const { isAuthenticated } = React.useContext(AuthContext);
  const location = useLocation();
  const { onRedirect } = useAuthRedirect();

  React.useEffect(() => {
    if (!isAuthenticated) {
      onRedirect();
    }
  }, [location.pathname]);

  return <>{children}</>;
};
