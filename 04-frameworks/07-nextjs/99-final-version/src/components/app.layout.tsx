import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import { routeConstants } from '../common';
import * as classes from './app.layout.styles';

export const AppLayout: React.FunctionComponent = (props) => {
  const { children } = props;
  const router = useRouter();

  return (
    <>
      <AppBar position="fixed">
        <Toolbar className={classes.toolbar} variant="dense">
          <IconButton
            className={classes.iconButton}
            onClick={() => router.push(routeConstants.root)}
          >
            <Image src="/home-logo.png" layout="fill" objectFit="contain" />
            {/* <img
              src="/home-logo.png"
              style={{
                width: '3rem',
                height: 'auto',
              }}
            /> */}
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
