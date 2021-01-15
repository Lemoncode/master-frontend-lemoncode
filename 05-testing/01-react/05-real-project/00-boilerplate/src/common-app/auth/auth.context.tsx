import React from 'react';
import { UserSession, createEmptyUserSession } from './auth.vm';

interface Context extends UserSession {
  setUserSession: (userSession: UserSession) => void;
  isAuthenticated: boolean;
}

const noUserLogin = 'no user login';

export const AuthContext = React.createContext<Context>({
  userName: noUserLogin,
  isAuthenticated: false,
  setUserSession: () =>
    console.warn(
      'If you area reading this, likely you forgot to add the provider on top of your app'
    ),
});

export const AuthProvider: React.FC = ({ children }) => {
  const [userSession, setUserSession] = React.useState<UserSession>(
    createEmptyUserSession()
  );

  const isAuthenticated = React.useMemo<boolean>(
    () => userSession.userName !== noUserLogin && userSession.userName !== '',
    [userSession.userName]
  );

  return (
    <AuthContext.Provider
      value={{
        userName: userSession.userName,
        isAuthenticated,
        setUserSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
