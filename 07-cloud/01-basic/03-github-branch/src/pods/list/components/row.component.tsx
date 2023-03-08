import React from 'react';
import { TableRow, TableCell } from '@mui/material';
import { Member } from '../list.vm';
import * as classes from './row.styles';

interface Props {
  member: Member;
}

export const RowComponent: React.FC<Props> = (props) => {
  const { member } = props;

  return (
    <TableRow>
      <TableCell>{member.id}</TableCell>
      <TableCell>{member.name}</TableCell>
      <TableCell>
        <img className={classes.image} src={member.imageUrl} />
      </TableCell>
    </TableRow>
  );
};
