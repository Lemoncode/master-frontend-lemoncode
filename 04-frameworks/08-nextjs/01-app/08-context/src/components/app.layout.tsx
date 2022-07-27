import React from 'react';
import Image from 'next/image';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import { UserContext } from '../common/contexts';
import logo from '../../public/home-logo.png';
import * as classes from './app.layout.styles';

export const AppLayout: React.FunctionComponent = (props) => {
  const { children } = props;
  const { user } = React.useContext(UserContext);

  return (
    <>
      <AppBar position="fixed">
        <Toolbar className={classes.toolbar} variant="dense">
          <IconButton className={classes.iconButton}>
            <Image
              src={logo}
              layout="fill"
              objectFit="contain"
              placeholder="blur"
            />
          </IconButton>
          <Typography variant="h6" color="inherit">
            Rent a car
          </Typography>
          <Typography variant="h6" color="inherit">
            {user}
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
