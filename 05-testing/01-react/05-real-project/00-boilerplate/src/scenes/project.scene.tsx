import React from 'react';
import { AppLayout } from 'layouts';
import { ProjectContainer } from 'pods/project';

export const ProjectScene: React.FunctionComponent = () => {
  return (
    <AppLayout>
      <ProjectContainer />
    </AppLayout>
  );
};
