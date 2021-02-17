import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import * as classes from './app.layout.styles';

export const AppLayout: React.FunctionComponent = (props) => {
  const { children } = props;

  return (
    <>
      <AppBar position="fixed">
        <Toolbar className={classes.toolbar} variant="dense">
          <Typography variant="h6" color="inherit">
            Rent a car
          </Typography>
        </Toolbar>
      </AppBar>
      <main className={classes.content}>
        <Toolbar variant="dense" />
        {children}
      </main>
    </>
  );
};
