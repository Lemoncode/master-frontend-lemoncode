import React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';

interface Props {
  title: string;
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
