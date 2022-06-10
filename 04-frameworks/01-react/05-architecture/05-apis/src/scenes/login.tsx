import React from "react";
import { LoginContainer } from "@/pods/login";
import { CenterLayout } from "@/layouts";

export const LoginPage: React.FC = () => {
  return (
    <CenterLayout>
      <LoginContainer />
    </CenterLayout>
  );
};
