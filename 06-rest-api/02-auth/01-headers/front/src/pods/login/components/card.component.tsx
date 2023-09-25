import React, { PropsWithChildren } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';

interface Props extends PropsWithChildren {
  title: string;
}

export const CardComponent: React.FC<Props> = (props) => {
  const { title, children } = props;
  return (
    <Card>
      <CardHeader title={title} />
      <CardContent>{children}</CardContent>
    </Card>
  );
};
