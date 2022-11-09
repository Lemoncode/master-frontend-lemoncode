import React from "react";
import { useAuthContext } from "core/auth";
import { Login } from "./login.component";
import { Credential } from "./login.vm";
import { mapCredentialFromVmToApi } from "./login.mappers";

export const LoginContainer: React.FC = () => {
  const { login } = useAuthContext();

  const handleSubmit = (credential: Credential) => {
    login(mapCredentialFromVmToApi(credential));
  };
  return <Login onSubmit={handleSubmit} />;
};
