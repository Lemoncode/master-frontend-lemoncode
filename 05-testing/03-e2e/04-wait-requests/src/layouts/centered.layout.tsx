import React from 'react';
import * as classes from './centered.layout.styles';

interface Props {
  children: React.ReactNode;
}

export const CenteredLayout: React.FC<Props> = (props) => (
  <div className={classes.root}>{props.children}</div>
);
