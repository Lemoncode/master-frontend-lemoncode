import React from 'react';
import { AppBar, Toolbar } from '@mui/material';
import logo from '#assets/logo.png';
import * as classes from './app.layout.styles';

interface ChildrenProps {
  className: string;
}

interface Props {
  children: (props: ChildrenProps) => React.ReactNode;
}

export const AppLayout: React.FC<Props> = (props) => {
  const { children } = props;

  return (
    <>
      <AppBar position="static">
        <Toolbar variant="dense" className={classes.root}>
          <img className={classes.logo} src={logo} />
        </Toolbar>
      </AppBar>
      <main>{children({ className: classes.content })}</main>
    </>
  );
};
