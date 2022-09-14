import React from "react";
import { jsx, css, useTheme } from "@emotion/react";

export const MyComponent = () => {
  return (
    <h1
      css={(theme: any) => css`
        color: ${theme.colors.primary};
      `}
    >
      Hello React !!
    </h1>
  );
};
