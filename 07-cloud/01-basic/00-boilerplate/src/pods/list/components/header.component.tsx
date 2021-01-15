import React from 'react';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import * as classes from './header.styles';

export const HeaderComponent: React.FunctionComponent = (props) => {
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
