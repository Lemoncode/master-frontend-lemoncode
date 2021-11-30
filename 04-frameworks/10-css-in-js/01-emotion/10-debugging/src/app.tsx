import React from "react";
import { css } from "@emotion/css";

const color = "red";

const h1Class = css`
  color: ${color};
`;

export const App = () => {
  return <h1 className={h1Class}>Hello React !!</h1>;
};
