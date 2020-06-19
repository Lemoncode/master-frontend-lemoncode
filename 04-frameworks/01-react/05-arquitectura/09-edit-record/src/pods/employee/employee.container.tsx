import React from 'react';
import { useParams } from 'react-router-dom';
import { EmployeeComponent } from './employee.component';

export const EmployeeContainer: React.FunctionComponent = () => {
  const { id } = useParams();

  return (
    <>
      <h1>{id}</h1>
      <EmployeeComponent />
    </>
  );
};
