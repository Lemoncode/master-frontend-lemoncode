import React from "react";
import styled from "styled-components";

interface Props {
  className?: string;
}

const Link: React.FC<Props> = ({ className, children }) => {
  return (
    <div className={className}>
      <a>{children}</a>
    </div>
  );
};

const StyledLink = styled(Link)`
  background-color: gray;
  & a {
    color: blue;
  }
`;

export const App = () => {
  return (
    <>
      <Link>Soy un enlace normal</Link>
      <StyledLink>Hola estoy estilado</StyledLink>
    </>
  );
};
