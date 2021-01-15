import React from 'react';
import { useHistory } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import LogoutIcon from '@material-ui/icons/PowerSettingsNew';
import { AuthContext, createEmptyUserSession, useAuthRequest } from '../auth';
import * as api from './api';
import * as classes from './app-bar.styles';

export const AppBarComponent: React.FunctionComponent = () => {
  const { userSession, onChangeUserSession } = React.useContext(AuthContext);
  const history = useHistory();
  const [logout] = useAuthRequest(api.logout);

  const handleLogout = async () => {
    await logout();
    onChangeUserSession(createEmptyUserSession());
    history.goBack();
  };

  return (
    <AppBar position="static">
      <Toolbar variant="dense" className={classes.root}>
        <Typography>{userSession.userName}</Typography>
        <IconButton
          className={classes.logout}
          edge="start"
          color="inherit"
          onClick={handleLogout}
        >
          <LogoutIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};
