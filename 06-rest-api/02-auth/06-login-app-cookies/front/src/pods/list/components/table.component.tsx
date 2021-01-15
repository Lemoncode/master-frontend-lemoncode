import React from 'react';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import { Item } from '../list.vm';
import { HeaderComponent } from './header.component';
import { RowComponent } from './row.component';

interface Props {
  itemList: Item[];
  className?: string;
}

export const TableComponent: React.FunctionComponent<Props> = (props) => {
  const { itemList, className } = props;

  return (
    <TableContainer className={className}>
      <Table>
        <HeaderComponent />
        <TableBody>
          {itemList.map((item) => (
            <RowComponent key={item.id} item={item} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
