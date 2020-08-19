import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuIcon from '@material-ui/icons/Menu';
import { literals } from 'core/i18n';
import { AuthContext, useLogout } from 'common-app/auth';
import { SideMenuComponent } from './components';
import { useMenu } from './app-bar.hook';
import * as classes from './app-bar.styles';

// TODO: Pending to implement dynamic menu
export const AppBarComponent: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const { userName } = React.useContext(AuthContext);
  const { onLogout } = useLogout();
  const { isOpen, menuElement, onOpenMenu, onCloseMenu } = useMenu();

  const handleLogout = () => {
    onCloseMenu();
    onLogout();
  };

  const handleSideMenu = () => setOpen(prev => !prev);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={handleSideMenu}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit">
            Origin - Project tracker
          </Typography>
          <Typography
            variant="h6"
            color="inherit"
            className={classes.loginText}
          >
            {literals.global.welcome} {userName}
          </Typography>
          <IconButton color="inherit" aria-label="menu" onClick={onOpenMenu}>
            <AccountCircle />
          </IconButton>
          <Menu open={isOpen} onClose={onCloseMenu} anchorEl={menuElement}>
            <MenuItem onClick={handleLogout}>
              {literals.components.fields.myProfile}
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              {literals.components.actions.logout}
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <SideMenuComponent open={open} onClick={handleSideMenu} />
    </>
  );
};
