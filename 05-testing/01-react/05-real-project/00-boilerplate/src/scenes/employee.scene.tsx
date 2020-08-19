import React from 'react';
import { AppLayout } from 'layouts';
import { EmployeeContainer } from 'pods/employee';

export const EmployeeScene: React.FunctionComponent = () => {
  return (
    <AppLayout>
      <EmployeeContainer />
    </AppLayout>
  );
};
