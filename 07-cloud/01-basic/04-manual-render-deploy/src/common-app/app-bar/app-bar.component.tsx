import React from 'react';
import { AppBar, Toolbar } from '@mui/material';
import * as classes from './app-bar.styles';

export const AppBarComponent: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar variant="dense" className={classes.root}>
        <img className={classes.logo} src="logo.png" />
      </Toolbar>
    </AppBar>
  );
};
