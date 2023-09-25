import React from 'react';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import * as classes from './header.styles';

export const HeaderComponent: React.FunctionComponent = (props) => {
  return (
    <TableHead>
      <TableRow>
        <TableCell className={classes.cell}>ID</TableCell>
        <TableCell className={classes.cell}>Name</TableCell>
      </TableRow>
    </TableHead>
  );
};
