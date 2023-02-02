import React from "react";
import { AppRouter } from "./core";
import { AuthProvider } from "core/auth";
import { AuthRouter } from "core/router/auth-router.component";
import "core/content/css/styles.css";

export const App: React.FC = () => (
  <AuthProvider AuthRouter={AuthRouter}>
    <AppRouter />
  </AuthProvider>
);
