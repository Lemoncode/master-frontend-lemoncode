import React from 'react';
import { AppLayout } from 'layouts';
import { SubmoduleListContainer } from 'pods/submoduleList';

export const SubmoduleListScene: React.FC = () => {
  return (
    <AppLayout>
      <SubmoduleListContainer />
    </AppLayout>
  );
};
