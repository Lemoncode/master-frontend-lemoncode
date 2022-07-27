import React from 'react';
import * as api from './user.api';
import { UserContext } from './user.context';
import { UserCredential, createEmptyUserCredential } from './user.vm';

export const useUser = () => {
  const { setUser } = React.useContext(UserContext);
  const [credentials, setCredentials] = React.useState<UserCredential>(
    createEmptyUserCredential()
  );
  const onLogin = async () => {
    const user = await api.login(credentials.email, credentials.password);
    setUser(user);
  };

  return { credentials, setCredentials, onLogin };
};
