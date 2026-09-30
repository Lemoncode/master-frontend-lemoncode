import type React from "react";

interface Props {
  children: React.ReactNode;
}

export const CenterLayout = (props: Props) => {
  const { children } = props;

  return <main className="hero min-h-screen">{children}</main>;
};
