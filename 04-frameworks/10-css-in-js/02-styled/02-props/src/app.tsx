import React from "react";
import styled from "styled-components";

interface ButtonProps {
  color: string;
}

const H1 = styled.h1<ButtonProps>`
  color: ${(props) => props.color};
`;

export const App = () => {
  const [tempColor, setTempColor] = React.useState("black");
  const [color, setColor] = React.useState(tempColor);

  return (
    <>
      <input value={tempColor} onChange={(e) => setTempColor(e.target.value)} />
      <button onClick={() => setColor(tempColor)}>Change</button>
      <H1 color={color}>Hello React !!</H1>
    </>
  );
};
