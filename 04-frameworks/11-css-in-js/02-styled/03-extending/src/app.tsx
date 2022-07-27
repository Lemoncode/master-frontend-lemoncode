import React from "react";
import styled from "styled-components";

const H1 = styled.h1`
  background: gray;
  color: green;
`;

const H1Alert = styled(H1)`
  color: red;
`;

export const App = () => {
  return (
    <>
      <H1>Hello React !!</H1>
      <H1Alert>Alert H1</H1Alert>
    </>
  );
};
