import React from "react";
import { ProfileContext } from "@/core/profile";

interface Props {
  children: React.ReactNode;
}

export const AppLayout: React.FC<Props> = ({ children }) => {
  const { userName } = React.useContext(ProfileContext);

  return (
    <div className="layout-app-container">
      <div className="layout-app-header">{userName}</div>
      {children}
    </div>
  );
};
