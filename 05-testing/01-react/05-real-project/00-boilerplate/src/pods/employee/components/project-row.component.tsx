import React from 'react';
import {
  RowRendererProps,
  RowComponent,
  CellComponent,
} from 'common/components';
import Checkbox from '@material-ui/core/Checkbox';
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
