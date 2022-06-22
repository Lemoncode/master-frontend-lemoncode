import React from 'react';
import { Typography, Box } from '@mui/material';

interface Props {
  index: number;
  value: any;
  children: React.ReactNode;
}

export const TabPanelComponent: React.FunctionComponent<Props> = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      {...other}
    >
      {value === index && children}
    </Typography>
  );
};
