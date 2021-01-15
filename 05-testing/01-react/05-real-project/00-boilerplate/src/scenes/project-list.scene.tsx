import React from 'react';
import { AppLayout } from 'layouts';
import { ProjectListContainer } from 'pods/project-list';

export const ProjectListScene: React.FunctionComponent = () => {
  return (
    <AppLayout>
      <ProjectListContainer />
    </AppLayout>
  );
};
