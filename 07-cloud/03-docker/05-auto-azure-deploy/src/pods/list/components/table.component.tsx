import React from 'react';
import { TableContainer, Table, TableBody } from '@mui/material';
import { Member } from '../list.vm';
import { HeaderComponent } from './header.component';
import { RowComponent } from './row.component';

interface Props {
  memberList: Member[];
  className?: string;
}

export const TableComponent: React.FC<Props> = (props) => {
  const { memberList, className } = props;

  return (
    <TableContainer className={className}>
      <Table>
        <HeaderComponent />
        <TableBody>
          {memberList.map((member) => (
            <RowComponent key={member.id} member={member} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
