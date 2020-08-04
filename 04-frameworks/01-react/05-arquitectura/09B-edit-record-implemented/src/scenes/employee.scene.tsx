import React from 'react';
import { Link } from 'react-router-dom';
import { routes } from 'core/router';
import { AppLayout } from 'layouts';
import { EmployeeContainer } from 'pods/employee';

export const EmployeeScene: React.FC = () => {
  return (
    <AppLayout>
      <EmployeeContainer />
    </AppLayout>
  );
};
