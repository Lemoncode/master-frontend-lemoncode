import React from 'react';
import { AppBar, Toolbar } from '@mui/material';
import logo from '@/assets/logo.png';
import * as classes from './app-bar.styles';

export const AppBarComponent: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar variant="dense" className={classes.root}>
        <img className={classes.logo} src={logo} />
      </Toolbar>
    </AppBar>
  );
};
