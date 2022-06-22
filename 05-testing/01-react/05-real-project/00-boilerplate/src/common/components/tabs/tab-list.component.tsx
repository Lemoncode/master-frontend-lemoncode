import React from 'react';
import { Tabs, TabsProps } from '@mui/material';

interface Props extends Omit<TabsProps, 'onChange'> {
  value: number;
  onChange: (value: number) => void;
}

export const TabListComponent: React.FunctionComponent<Props> = (props) => {
  const { value, onChange, ...otherProps } = props;

  const handleChange = (event, value) => {
    onChange(value);
  };

  return <Tabs {...otherProps} onChange={handleChange} value={value} />;
};
