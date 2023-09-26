import React from 'react';
import { CenteredLayout } from 'layouts';
import { LoginContainer } from 'pods/login';

export const LoginScene: React.FC = () => {
  return (
    <CenteredLayout>
      <LoginContainer />
    </CenteredLayout>
  );
};
