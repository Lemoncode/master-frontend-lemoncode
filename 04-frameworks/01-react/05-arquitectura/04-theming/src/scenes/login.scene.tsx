import React from 'react';
import { LoginContainer } from 'pods/login';
import { CenteredLayout } from 'layout';

export const LoginScene: React.FC = () => {
  return (
    <CenteredLayout>
      <LoginContainer />
    </CenteredLayout>
  );
};
