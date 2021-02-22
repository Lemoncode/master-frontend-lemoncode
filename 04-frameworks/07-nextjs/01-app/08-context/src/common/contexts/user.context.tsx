import React from 'react';

interface Context {
  user: string;
  setUser: (user: string) => void;
}

export const UserContext = React.createContext<Context>(null);

export const UserProvider: React.FunctionComponent = (props) => {
  const [user, setUser] = React.useState('');

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {props.children}
    </UserContext.Provider>
  );
};
