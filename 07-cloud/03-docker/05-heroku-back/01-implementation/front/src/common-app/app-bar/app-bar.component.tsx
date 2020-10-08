import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import logo from 'assets/logo.png';
import * as classes from './app-bar.styles';

export const AppBarComponent: React.FunctionComponent = () => {
  return (
    <AppBar position="static">
      <Toolbar variant="dense" className={classes.root}>
        <img className={classes.logo} src={logo} />
      </Toolbar>
    </AppBar>
  );
};
