import React from 'react';
import { useStyles } from './centered.layout.styles';

export const CenteredLayout = props => {
  const { children } = props;
  const classes = useStyles();
  return <div className={classes.container}>{children}</div>;
};
