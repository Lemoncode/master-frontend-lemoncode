import React from "react";
import { AuthContext } from "./auth.context";

export const useAuth = () => {
  const context = React.useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth tiene que usarse dentro de <AuthProvider>");
  }

  return context;
};
