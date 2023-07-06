import React from "react";
import { useProfileContext } from "core/providers";

interface Props {
  children: React.ReactNode;
}

export const AppLayout: React.FC<Props> = ({ children }) => {
  const { userName } = useProfileContext();

  return (
    <div className="layout-app-container">
      <div className="layout-app-header">{userName}</div>
      {children}
    </div>
  );
};
