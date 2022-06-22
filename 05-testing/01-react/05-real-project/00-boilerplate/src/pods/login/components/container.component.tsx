import React from 'react';
import { Container, Avatar, Typography } from '@mui/material';
import { LockOutlined as LockOutlinedIcon } from '@mui/icons-material';
import * as classes from './container.styles';

interface Props {
  title: string;
  children: React.ReactNode;
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
