import React from 'react';
import { Link } from 'react-router-dom';
import { routes } from 'core/router';

export const SubmoduleListScene: React.FC = () => {
  return (
    <>
      <h1>Submodule list Scene!</h1>
      <Link to={routes.employees}>Navigate employee list</Link>
    </>
  );
};
