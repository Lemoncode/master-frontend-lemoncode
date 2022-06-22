import React from 'react';
import { cx } from '@emotion/css';
import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { DashboardItemProps } from '../dashboard.vm';
import * as innerClasses from './item.styles';

export interface ClassesProps {
  root?: string;
  icon?: string;
  title?: string;
  subtitle?: string;
}

interface Props {
  item: DashboardItemProps;
  classes?: ClassesProps;
  dataTestId?: string;
}

export const ItemComponent: React.FC<Props> = (props) => {
  const {
    item: { icon: Icon, title, linkTo, subtitle },
    classes,
    dataTestId,
  } = props;
  return (
    <Link
      className={cx(innerClasses.root, classes.root)}
      to={linkTo}
      data-testid={dataTestId}
    >
      <Icon className={cx(innerClasses.icon, classes.icon)} />
      <Typography
        variant="h5"
        className={cx(innerClasses.title, classes.title)}
      >
        {title}
      </Typography>
      <Typography
        variant="h6"
        className={cx(innerClasses.subtitle, classes.subtitle)}
      >
        {subtitle}
      </Typography>
    </Link>
  );
};

ItemComponent.defaultProps = {
  classes: {
    root: '',
    icon: '',
    title: '',
    subtitle: '',
  },
};
