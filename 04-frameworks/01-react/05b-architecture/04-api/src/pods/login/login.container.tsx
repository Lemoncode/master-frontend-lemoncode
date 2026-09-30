import React from "react";
import { useNavigate } from "react-router";
import { useAuth } from "#core/auth";
import { ROUTES } from "#core/router";
import { login } from "./api";
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
      const userSession = await login(credentials);
      setUserSession(userSession);
      navigate(ROUTES.CHARACTERS);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <LoginComponent error={error} isPending={isPending} onLogin={handleLogin} />
  );
};
