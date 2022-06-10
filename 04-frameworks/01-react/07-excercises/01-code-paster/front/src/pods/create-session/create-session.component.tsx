import React from 'react';
import { Link } from 'react-router-dom';
import { routes } from 'core/router';
import { TestRunnerTrainerComponent } from './components/test-runner-trainer.component';
import { TestRunnerStudentComponent } from './components/test-runner-student.component';

interface Props {}

export const CreateSessionComponent: React.FunctionComponent<Props> = props => {
  return (
    <>
      <h1>Create Session component</h1>
      <Link to={routes.trainer('myroom', 'mytrainertoken')}>
        Create Session - Navigate to trainer page
      </Link>

      <TestRunnerTrainerComponent />
      <TestRunnerStudentComponent />
    </>
  );
};
