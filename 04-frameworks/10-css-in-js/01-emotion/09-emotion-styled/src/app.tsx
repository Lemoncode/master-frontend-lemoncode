import React from "react";
import styled from "@emotion/styled";

const color = "red";

const H1 = styled.h1`
  color: ${color};
`;

export const App = () => {
  return <H1>Hello React !!</H1>;
};
