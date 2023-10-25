import React from "react";
import { Link as LinkRouter } from "react-router-dom";
import { cx } from "@emotion/css";
import * as classes from "./button.styles";

interface Props {
  route: string;
  className?: string;
  label: string;
}

export const Button: React.FC<Props> = (props) => {
  const { route, className, label } = props;
  return (
    <LinkRouter to={route} className={cx(classes.link, className)}>
      {label}
    </LinkRouter>
  );
};
