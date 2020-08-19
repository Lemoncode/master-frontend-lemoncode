import React from 'react';
import { AppLayout } from 'layouts';
import { EmployeeListContainer } from 'pods/employee-list';

export const EmployeeListScene: React.FunctionComponent = () => {
  return (
    <AppLayout>
      <EmployeeListContainer />
    </AppLayout>
  );
};
