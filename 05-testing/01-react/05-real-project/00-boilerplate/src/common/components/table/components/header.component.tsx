import React from 'react';
import { HeaderGroup } from 'react-table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { CellComponent } from './cell.component';

interface Props {
  headerGroups: HeaderGroup[];
}

export const HeaderComponent: React.FunctionComponent<Props> = props => {
  const { headerGroups } = props;
  return (
    <TableHead>
      {headerGroups.map(headerGroup => (
        <TableRow {...headerGroup.getHeaderGroupProps()}>
          {headerGroup.headers.map(column => (
            <CellComponent {...column.getHeaderProps()}>
              {column.render('Header')}
            </CellComponent>
          ))}
        </TableRow>
      ))}
    </TableHead>
  );
};
