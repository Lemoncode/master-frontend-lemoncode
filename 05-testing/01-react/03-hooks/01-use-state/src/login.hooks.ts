import React from 'react';
import { Credential } from './model';

export const useLogin = () => {
  const [credential, setCredential] = React.useState<Credential>({
    name: '',
    password: '',
  });

  return {
    credential,
    setCredential,
  };
};
