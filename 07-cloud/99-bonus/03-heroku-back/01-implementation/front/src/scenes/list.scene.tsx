import React from 'react';
import { AppLayout } from '@/layouts';
import { ListContainer } from '@/pods/list';

export const ListScene: React.FC = () => {
  return (
    <AppLayout>
      {({ className }) => <ListContainer className={className} />}
    </AppLayout>
  );
};
