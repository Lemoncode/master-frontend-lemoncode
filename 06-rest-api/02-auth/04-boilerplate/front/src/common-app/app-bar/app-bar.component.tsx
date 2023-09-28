import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LogoutIcon from '@mui/icons-material/PowerSettingsNew';
import { AuthContext, createEmptyUserSession } from '../auth';
import * as api from './api';
import * as classes from './app-bar.styles';

export const AppBarComponent: React.FC = () => {
  const { userSession, onChangeUserSession } = React.useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.logout();
      onChangeUserSession(createEmptyUserSession());
      navigate(-1);
    } catch {}
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
