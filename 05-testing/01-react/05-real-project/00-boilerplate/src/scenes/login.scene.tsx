import React from 'react';
import { CenteredLayout } from 'layouts';
import { LoginContainer } from 'pods/login';

export const LoginScene: React.FunctionComponent = () => {
  return (
    <CenteredLayout>
      <LoginContainer />
    </CenteredLayout>
  );
};
