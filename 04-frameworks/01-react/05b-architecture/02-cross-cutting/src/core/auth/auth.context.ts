import React from "react";
import type { UserSession } from "./auth.vm";

export interface AuthContextModel {
  userSession: UserSession | null;
  isChecking: boolean;
  setUserSession: (userSession: UserSession | null) => void;
  logout: () => Promise<void>;
}

export const AuthContext = React.createContext<AuthContextModel | null>(null);
