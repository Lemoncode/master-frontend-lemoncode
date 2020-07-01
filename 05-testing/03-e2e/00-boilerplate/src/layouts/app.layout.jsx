import React from 'react';
import { connect } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { useFlasher } from 'common/hooks';

const InnerAppLayout = props => {
  const { login, children } = props;

  return (
    <div>
      <AppBar position="static">
        <Toolbar variant="dense">
          <IconButton color="inherit" aria-label="Menu">
            <AccountCircle />
          </IconButton>
          <Typography ref={useFlasher()} variant="h6" color="inherit">
            {login}
          </Typography>
        </Toolbar>
      </AppBar>
      {children}
    </div>
  );
};

const mapStateToProps = state => ({
  login: state.core.login,
});

export const AppLayout = connect(mapStateToProps)(InnerAppLayout);
