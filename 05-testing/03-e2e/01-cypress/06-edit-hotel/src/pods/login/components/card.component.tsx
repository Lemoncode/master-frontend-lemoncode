import React from 'react';
import { Card, CardHeader, CardContent } from '@mui/material';

interface Props {
  title: string;
  children: React.ReactNode;
}

export const CardComponent: React.FunctionComponent<Props> = (props) => {
  const { title, children } = props;

  return (
    <Card>
      <CardHeader title={title} />
      <CardContent>{children}</CardContent>
    </Card>
  );
};
