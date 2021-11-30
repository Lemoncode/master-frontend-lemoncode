import React from "react";
import { jsx, css } from "@emotion/react";

const color = "red";

const h1Class = css`
  color: ${color};
`;

export const App = () => {
  return <h1 css={h1Class}>Hello React !!</h1>;
};
