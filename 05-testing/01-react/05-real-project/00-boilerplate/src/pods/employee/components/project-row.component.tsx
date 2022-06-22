import React from 'react';
import { Checkbox } from '@mui/material';
import {
  RowRendererProps,
  RowComponent,
  CellComponent,
} from 'common/components';
import { ProjectSummary } from '../employee.vm';

type Props = RowRendererProps<ProjectSummary>;

export const EmployeeRowComponent: React.FunctionComponent<Props> = ({
  row,
}) => {
  return (
    <RowComponent>
      <CellComponent>
        <Checkbox checked={row.isAssigned} color="primary" />
      </CellComponent>
      <CellComponent>{row.projectName}</CellComponent>
    </RowComponent>
  );
};
