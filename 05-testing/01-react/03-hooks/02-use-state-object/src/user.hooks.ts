import * as React from 'react';
import { User } from './model';

export const useUser = (initialUser: User) => {
  const [user, setUser] = React.useState(initialUser);

  return {
    user,
    setUser,
  };
};
