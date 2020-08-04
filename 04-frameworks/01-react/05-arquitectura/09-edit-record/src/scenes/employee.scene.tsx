import React from 'react';
import { AppLayout } from 'layouts';
import { EmployeeContainer } from 'pods/employee';

export const EmployeeScene: React.FC = () => {
  return (
    <AppLayout>
      <EmployeeContainer />
    </AppLayout>
  );
};
