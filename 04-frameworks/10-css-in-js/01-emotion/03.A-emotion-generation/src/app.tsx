import React from "react";
import { css } from "@emotion/css";

const color = "red";

const h1Class = css`
  color: ${color};
`;

export const App = () => {
  const [tempColor, setTempColor] = React.useState("red");
  const [color, setColor] = React.useState("red");

  const h1Class = css`
    color: ${color};
  `;

  return (
    <>
      <input
        value={tempColor}
        onChange={(e) => setTempColor(e.target.value)}
      ></input>
      <button onClick={(e) => setColor(tempColor)}>Change</button>
      <h1 className={h1Class}>Hello React !!</h1>
    </>
  );
};
