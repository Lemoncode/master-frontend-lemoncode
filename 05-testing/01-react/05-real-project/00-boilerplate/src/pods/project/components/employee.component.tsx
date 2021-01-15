import React from 'react';
import { TableContainer, RowRendererProps } from 'common/components';
import { EmployeeSummary } from '../project.vm';
import { CommandFooterComponent } from 'common-app/command-footer';
import { ProjectRowComponent } from './employee-row.component';

interface Props {
  employeeSummaryList: EmployeeSummary[];
  onCancel: () => void;
  className: string;
}

export const EmployeeComponent: React.FunctionComponent<Props> = ({
  employeeSummaryList,
  onCancel,
  className,
}) => {
  return (
    <>
      <TableContainer
        columns={['Asignado', 'Empleado']}
        rows={employeeSummaryList}
        className={className}
        rowRenderer={(rowProps: RowRendererProps<EmployeeSummary>) => (
          <ProjectRowComponent {...rowProps} />
        )}
      />
      <CommandFooterComponent onCancel={onCancel} />
    </>
  );
};
