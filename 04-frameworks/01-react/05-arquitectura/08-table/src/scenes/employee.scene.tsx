import React from 'react';
import { Link } from 'react-router-dom';
import { routes } from 'core/router';
import { AppLayout } from 'layouts';

export const EmployeeScene: React.FC = () => {
  return (
    <AppLayout>
      <h1>Employee Scene!</h1>
      <Link to={routes.employees}>Back to employee list</Link>
    </AppLayout>
  );
};
