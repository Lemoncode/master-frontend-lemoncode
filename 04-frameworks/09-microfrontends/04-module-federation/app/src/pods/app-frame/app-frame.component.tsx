import React from "react";
import { css } from "@emotion/css";
import { Link } from "react-router-dom";
import { routes } from "../../core";

const styles = {
  container: css`
    margin: 2rem 1rem;
    display: grid;
    grid-auto-flow: column;
    grid-gap: 2rem;
    justify-content: center;
    align-items: center;
    font-family: Montserrat, sans-serif;
    font-size: 1.25rem;
  `,
};

export interface AppFrameProps {
  children?: React.ReactNode;
}

export const AppFrame: React.FC<AppFrameProps> = ({ children }) => {
  return (
    <>
      <div className={styles.container}>
        <Link to={routes.home}>Home</Link>
        <Link to={routes.clock}>Clock</Link>
        <Link to={routes.quote}>Quote</Link>
      </div>
      {children}
    </>
  );
};
