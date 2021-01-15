import React from 'react';
import { AppLayout } from 'layouts';
import { ListContainer } from 'pods/list';

export const ListScene: React.FunctionComponent = () => {
  return (
    <AppLayout>
      {({ className }) => <ListContainer className={className} />}
    </AppLayout>
  );
};
