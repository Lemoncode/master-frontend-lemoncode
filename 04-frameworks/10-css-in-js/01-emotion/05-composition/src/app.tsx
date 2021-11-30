import React from "react";
import { jsx, css } from "@emotion/react";

const danger = css`
  color: red;
`;

const base = css`
  background-color: lightgray;
  color: blue;
`;

export const App = () => {
  return (
    <div>
      <h1 css={[base, danger]}>Aquí el texto sale en rojo (gana danger)</h1>
      <h1 css={[danger, base]}>Aquí el texto sale en azul (gana base)</h1>
    </div>
  );
};
