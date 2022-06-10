import * as React from 'react';
import { Link } from 'react-router-dom';
import { routes } from 'core/router';

interface Props {}

export const TrainerComponent: React.FC<Props> = props => {
  return (
    <>
      <h1>Trainer Component</h1>
      <Link to={routes.student('myroom')}>
        Create Session - Navigate to student page
      </Link>
    </>
  );
};
