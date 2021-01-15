import React from 'react';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import { Member } from '../list.vm';
import { HeaderComponent } from './header.component';
import { RowComponent } from './row.component';

interface Props {
  memberList: Member[];
  className?: string;
}

export const TableComponent: React.FunctionComponent<Props> = (props) => {
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
