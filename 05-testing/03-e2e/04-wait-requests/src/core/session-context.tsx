import * as React from 'react';

interface Context {
  login: string;
  updateLogin: (value: string) => void;
}

export const SessionContext = React.createContext<Context>({
  login: 'no user',
  updateLogin: value => {
    console.warn(
      'if you are reading this, likely you forgot to add the provider on top of your app'
    );
  },
});

export const SessionProvider: React.FunctionComponent = props => {
  const [login, setLogin] = React.useState('');

  return (
    <SessionContext.Provider value={{ login, updateLogin: setLogin }}>
      {props.children}
    </SessionContext.Provider>
  );
};
