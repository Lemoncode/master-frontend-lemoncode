import React from 'react';
import Container from '@material-ui/core/Container';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import * as classes from './container.styles';

interface Props {
  title: string;
}

export const ContainerComponent: React.FC<Props> = ({ children, title }) => (
  <Container component="main" maxWidth="xs">
    <div className={classes.paper}>
      <Avatar className={classes.avatar}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        {title}
      </Typography>
      {children}
    </div>
  </Container>
);
