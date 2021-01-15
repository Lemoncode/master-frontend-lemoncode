import React from 'react';
import { Route, RouteProps } from 'react-router-dom';
import { AuthContext } from './auth.context';
import { useAuthRedirect } from './auth.hooks';

export const AuthRouterComponent: React.FC<RouteProps> = props => {
  const { isAuthenticated } = React.useContext(AuthContext);
  const { onRedirect } = useAuthRedirect();

  React.useEffect(() => {
    if (!isAuthenticated) {
      onRedirect();
    }
  }, [props.location.pathname]);

  return <Route {...props} />;
};
