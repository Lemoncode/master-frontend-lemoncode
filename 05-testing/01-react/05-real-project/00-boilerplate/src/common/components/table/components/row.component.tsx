import React from 'react';
import TableRow, { TableRowProps } from '@material-ui/core/TableRow';
import { cx } from 'emotion';
import * as classes from './row.component.styles';

interface Props extends TableRowProps {
  className?: string;
  'data-testid'?: string;
}

export const RowComponent: React.FunctionComponent<Props> = props => {
  const { className, children, ...rest } = props;
  return (
    <TableRow
      {...rest}
      className={cx(classes.root, className)}
      data-testid={props['data-testid']}
    >
      {children}
    </TableRow>
  );
};
