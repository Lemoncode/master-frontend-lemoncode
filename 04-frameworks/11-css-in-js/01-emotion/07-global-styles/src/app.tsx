import React from "react";
import { Global, jsx, css } from "@emotion/react";

const color = "red";

const h1Class = css`
  color: ${color};
`;

const globalStyles = css`
  .base-background {
    background-color: gray;
  }
`;

export const App = () => {
  return (
    <div>
      <Global styles={globalStyles} />
      <h1 className="base-background" css={h1Class}>
        Hello React !!
      </h1>
    </div>
  );
};
