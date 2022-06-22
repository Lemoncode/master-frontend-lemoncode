import React from 'react';
import * as classes from './centered.layout.styles';

interface Props {
  children: React.ReactNode;
}

export const CenteredLayout: React.FC<Props> = (props) => {
  const { children } = props;
  return <div className={classes.root}>{children}</div>;
};
