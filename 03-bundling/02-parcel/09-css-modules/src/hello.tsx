import React from "react";
const logo = require("./content/logo_1.png");
const classes = require("./mystyles.scss");

export const HelloComponent: React.FC = () => {
  return (
    <div className={classes.hello}>
      <img src={logo} className={classes.logo} />
      <h2>Hello from React</h2>
    </div>
  );
};
