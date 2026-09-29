import React from "react";

export interface User {
  username: string;
  name: string;
}

export const useSession = () => {
  const [user, setUser] = React.useState<User | null>(null);
  const [isChecking, setIsChecking] = React.useState(true);

  React.useEffect(() => {
    fetch("/api/me")
      .then((response) => (response.ok ? response.json() : null))
      .then((user) => {
        setUser(user);
      })
      .catch(() => setUser(null))
      .finally(() => setIsChecking(false));
  }, []);

  const logout = async () => {
    await fetch("/api/logout", { method: "POST" });
    setUser(null);
  };

  return { user, isChecking, setUser, logout };
};
