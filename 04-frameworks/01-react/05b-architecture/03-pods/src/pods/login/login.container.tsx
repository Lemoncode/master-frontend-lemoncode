import React from "react";
import { useNavigate } from "react-router";
import { useAuth } from "#core/auth";
import { ROUTES } from "#core/router";
import { LoginComponent } from "./login.component";
import type { Credentials } from "./login.schema";

export const LoginContainer = () => {
  const { setUserSession } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = React.useState("");
  const [isPending, setIsPending] = React.useState(false);

  const handleLogin = async (credentials: Credentials) => {
    setError("");
    setIsPending(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      }

      setUserSession(data);
      navigate(ROUTES.CHARACTERS);
    } catch {
      setError("No se ha podido conectar con el servidor");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <LoginComponent error={error} isPending={isPending} onLogin={handleLogin} />
  );
};
