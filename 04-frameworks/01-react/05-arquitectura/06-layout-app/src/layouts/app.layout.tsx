import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { AuthContext } from 'common-app/auth';
import * as classes from './app.layout.styles';

export const AppLayout: React.FC = ({ children }) => {
  const { userName } = React.useContext(AuthContext);

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" color="inherit">
            Origin - Project tracker
          </Typography>
          <Typography
            variant="h6"
            color="inherit"
            className={classes.loginText}
          >
            {userName}
          </Typography>
        </Toolbar>
      </AppBar>
      {children}
    </div>
  );
};
