import React from 'react';
import { User } from './model';

export const useLogin = () => {
  const [user, setUser] = React.useState<User>({ name: '', password: '' });

  return {
    user,
    setUser,
  };
};
