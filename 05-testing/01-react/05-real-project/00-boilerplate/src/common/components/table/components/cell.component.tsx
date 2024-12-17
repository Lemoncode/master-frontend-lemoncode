import React from 'react';
import { TableCell, TableCellProps } from '@mui/material';
import * as classes from './cell.styles';

export const CellComponent: React.FunctionComponent<TableCellProps> = (
  props
) => {
  const { children, align = 'left', ...rest } = props;
  return (
    <TableCell classes={{ head: classes.head }} align={align} {...rest}>
      {children}
    </TableCell>
  );
};
