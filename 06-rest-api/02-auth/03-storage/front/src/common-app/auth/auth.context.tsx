import React from 'react';
import { UserSession, createEmptyUserSession } from './auth.vm';

interface Context {
  userSession: UserSession;
  onChangeUserSession: (userSession: UserSession) => void;
}

export const AuthContext = React.createContext<Context>(null);

export const AuthProviderComponent: React.FunctionComponent = (props) => {
  const [userSession, setUserSession] = React.useState(
    createEmptyUserSession()
  );

  return (
    <AuthContext.Provider
      value={{
        userSession,
        onChangeUserSession: setUserSession,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
