import React from 'react';
import { Link } from 'react-router-dom';
import { routes } from 'core/router';

export const LoginScene: React.FC = () => {
  return (
    <>
      <h1>Hello from Login Scene!</h1>
      <Link to={routes.submoduleList}>Navigate to submodule list</Link>
    </>
  );
};
