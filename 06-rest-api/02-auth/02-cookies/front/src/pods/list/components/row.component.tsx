import React from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Item } from '../list.vm';

interface Props {
  item: Item;
}

export const RowComponent: React.FunctionComponent<Props> = (props) => {
  const { item } = props;

  return (
    <TableRow>
      <TableCell>{item.id}</TableCell>
      <TableCell>{item.name}</TableCell>
    </TableRow>
  );
};
