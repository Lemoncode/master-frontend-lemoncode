import React from 'react';
import Image from 'next/image';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import classes from './app.layout.module.css';

interface Props {
  children: React.ReactNode;
}

export const AppLayout: React.FC<Props> = (props) => {
  const { children } = props;

  return (
    <>
      <AppBar position="fixed">
        <Toolbar className={classes.toolbar} variant="dense">
          <IconButton className={classes.iconButton}>
            <Image
              className={classes.image}
              alt="Lemoncode logo"
              src="/home-logo.png"
              fill={true}
            />
          </IconButton>
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
