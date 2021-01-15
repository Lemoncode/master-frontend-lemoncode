import React from 'react';
import * as classes from './centered.layout.styles';

export const CenteredLayout: React.FunctionComponent = (props) => (
  <div className={classes.root}>{props.children}</div>
);
