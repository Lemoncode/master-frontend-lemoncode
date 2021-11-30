import React from "react";
import { jsx, css } from "@emotion/react";

const color = "red";

const h1Class = {
  color: color,
  "&:hover": {
    color: "blue",
  },
};

export const App = () => {
  return <h1 css={h1Class}>Hello React !!</h1>;
};
