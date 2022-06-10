import React from "react";

interface Props {
  children: React.ReactNode;
}

export const CenterLayout: React.FC<Props> = ({ children }) => (
  <div className="layout-center">{children}</div>
);
