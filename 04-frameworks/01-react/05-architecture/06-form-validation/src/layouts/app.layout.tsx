import React from "react";
import { ProfileContext } from "@/core/profile";

export const AppLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { userName } = React.useContext(ProfileContext);

  return (
    <div className="layout-app-container">
      <div className="layout-app-header">{userName}</div>
      {children}
    </div>
  );
};
