import React from 'react';
import { TableCell, TableCellProps } from '@mui/material';
import * as classes from './cell.styles';

export const CellComponent: React.FunctionComponent<TableCellProps> = (
  props
) => {
  const { children, ...rest } = props;
  return (
    <TableCell classes={{ head: classes.head }} {...rest}>
      {children}
    </TableCell>
  );
};

CellComponent.defaultProps = {
  align: 'left',
};
