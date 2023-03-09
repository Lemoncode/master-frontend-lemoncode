import React from 'react';
import { TableHead, TableRow, TableCell } from '@mui/material';
import * as classes from './header.styles';

export const HeaderComponent: React.FC = (props) => {
  return (
    <TableHead>
      <TableRow>
        <TableCell className={classes.cell}>ID</TableCell>
        <TableCell className={classes.cell}>Name</TableCell>
        <TableCell className={classes.cell}>Avatar</TableCell>
      </TableRow>
    </TableHead>
  );
};
