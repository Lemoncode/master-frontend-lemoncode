import React from 'react';
import { AppLayout } from 'layouts';
import { EmployeeListContainer } from 'pods/employee-list';

export const EmployeeListScene: React.FC = () => {
  return (
    <AppLayout>
      <EmployeeListContainer />
    </AppLayout>
  );
};
