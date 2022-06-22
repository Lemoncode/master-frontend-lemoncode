import * as React from 'react';
import { Tab, TabProps } from '@mui/material';

type Props = TabProps;

export const TabComponent: React.FunctionComponent<Props> = (props) => {
  const { ...otherProps } = props;

  return <Tab {...otherProps} />;
};
