import React from 'react';
import { Checkbox } from '@mui/material';
import {
  RowRendererProps,
  RowComponent,
  CellComponent,
} from 'common/components';
import { EmployeeSummary } from '../project.vm';

type Props = RowRendererProps<EmployeeSummary>;

export const ProjectRowComponent: React.FunctionComponent<Props> = ({
  row,
}) => {
  return (
    <RowComponent>
      <CellComponent>
        <Checkbox checked={row.isAssigned} color="primary" />
      </CellComponent>
      <CellComponent>{row.employeeName}</CellComponent>
    </RowComponent>
  );
};
