import React from 'react';
import { Row } from '@tanstack/react-table';
import { TableBody } from '@mui/material';
import { RowRendererProps } from '../table.vm';

interface Props<T> {
  rows: Row<T>[];
  rowRenderer: (props: RowRendererProps<T>) => React.ReactNode;
}

export const BodyComponent = <T,>(props: Props<T>) => {
  const { rows, rowRenderer } = props;
  return (
    <TableBody>
      {rows.map((row) => (
        <React.Fragment key={row.id}>
          {rowRenderer({
            ...row,
            row: row.original,
          })}
        </React.Fragment>
      ))}
    </TableBody>
  );
};
