import React from 'react';
import { Row } from 'react-table';
import TableBody from '@material-ui/core/TableBody';
import { RowRendererProps } from '../table.vm';

interface Props<T extends object = {}> {
  rows: Row<T>[];
  prepareRow: (row: Row<T>) => void;
  rowRenderer: (props: RowRendererProps<T>) => React.ReactNode;
}

export const BodyComponent: React.FunctionComponent<Props> = props => {
  const { rows, prepareRow, rowRenderer } = props;
  return (
    <TableBody>
      {rows.map(row => {
        prepareRow(row);
        return rowRenderer({
          ...row.getRowProps(),
          row: row.original,
        });
      })}
    </TableBody>
  );
};
