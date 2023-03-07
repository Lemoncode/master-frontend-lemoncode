import React from 'react';
import { cx } from '@emotion/css';
import { Typography } from '@mui/material';
import { TableComponent } from './components';
import { Member } from './list.vm';
import * as classes from './list.styles';

interface Props {
  organization: string;
  memberList: Member[];
  className?: string;
}

export const ListComponent: React.FC<Props> = (props) => {
  const { organization, memberList, className } = props;

  return (
    <div className={cx(classes.root, className)}>
      <Typography className={classes.title} variant="h2">
        Organization: {organization}
      </Typography>
      <TableComponent className={classes.memberList} memberList={memberList} />
    </div>
  );
};
