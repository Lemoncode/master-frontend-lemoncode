import React from "react";
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
    fetch("/api/me")
      .then((response) => (response.ok ? response.json() : null))
      .then((userSession) => {
        setUserSession(userSession);
      })
      .catch(() => setUserSession(null))
      .finally(() => setIsChecking(false));
  }, []);

  const logout = async () => {
    await fetch("/api/logout", { method: "POST" });
    setUserSession(null);
  };

  return (
    <AuthContext value={{ userSession, isChecking, setUserSession, logout }}>
      {children}
    </AuthContext>
  );
};
