import React from "react";
import * as api from "./api";
import { AuthContext } from "./auth.context";
import { mapUserToVM } from "./auth.mappers";
import { User } from "./auth.model";

interface Props {
  AuthRouter: React.FC;
}

export const AuthProvider: React.FC<Props> = (props) => {
  const { AuthRouter, children } = props;
  const [user, setUser] = React.useState<User>();

  React.useEffect(() => {
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    api
      .getCurrentUser()
      .then(mapUserToVM)
      .then(setUser)
      .catch(() => {});
  };

  const login = async (loginCredential: api.LoginCredential) => {
    await api.doLogin(loginCredential);
    await getCurrentUser();
  };

  const logout = async () => {
    await api.doLogout().then(() => setUser(null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {user ? children : <AuthRouter />}
    </AuthContext.Provider>
  );
};
