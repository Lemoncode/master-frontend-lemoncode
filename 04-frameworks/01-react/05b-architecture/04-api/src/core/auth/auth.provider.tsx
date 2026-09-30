import React from "react";
import * as api from "./auth.api";
import { AuthContext } from "./auth.context";
import type { UserSession } from "./auth.vm";

interface Props {
  children: React.ReactNode;
}

export const AuthProvider = (props: Props) => {
  const { children } = props;
  const [userSession, setUserSession] = React.useState<UserSession | null>(
    null,
  );
  const [isChecking, setIsChecking] = React.useState(true);

  React.useEffect(() => {
    api
      .getUserSession()
      .then(setUserSession)
      .catch(() => setUserSession(null))
      .finally(() => setIsChecking(false));
  }, []);

  const logout = async () => {
    await api.logout();
    setUserSession(null);
  };

  return (
    <AuthContext value={{ userSession, isChecking, setUserSession, logout }}>
      {children}
    </AuthContext>
  );
};
