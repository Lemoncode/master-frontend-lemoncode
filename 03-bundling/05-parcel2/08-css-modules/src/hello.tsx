import React from "react";
import * as classes from "./hello.module.css";

export const HelloComponent: React.FC = () => {
  return <h1 className={classes.background}>Hello from React</h1>;
};
