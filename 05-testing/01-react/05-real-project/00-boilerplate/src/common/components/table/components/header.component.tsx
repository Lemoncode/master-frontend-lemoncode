import React from 'react';
import { HeaderGroup, flexRender } from '@tanstack/react-table';
import { TableHead, TableRow } from '@mui/material';
import { CellComponent } from './cell.component';

interface Props {
  headerGroups: HeaderGroup<any>[];
}

export const HeaderComponent: React.FunctionComponent<Props> = (props) => {
  const { headerGroups } = props;
  return (
    <TableHead>
      {headerGroups.map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <CellComponent key={header.id}>
              {flexRender(header.column.columnDef.header, header.getContext())}
            </CellComponent>
          ))}
        </TableRow>
      ))}
    </TableHead>
  );
};
