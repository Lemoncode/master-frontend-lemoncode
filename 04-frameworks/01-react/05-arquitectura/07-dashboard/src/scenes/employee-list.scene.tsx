import React from 'react';
import { Link } from 'react-router-dom';
import { routes } from 'core/router';
import { AppLayout } from 'layouts';

export const EmployeeListScene: React.FC = () => {
  return (
    <AppLayout>
      <h1>Employee list Scene!</h1>
      <Link to={routes.editEmployee('232')}>Navigate to edit employee 232</Link>
      </AppLayout>
  );
};
