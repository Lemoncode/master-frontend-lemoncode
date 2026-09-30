import React from "react";
import type { UserSession } from "./auth.vm";

export const useAuth = () => {
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

  return { userSession, isChecking, setUserSession, logout };
};
