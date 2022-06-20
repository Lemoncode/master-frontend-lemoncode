import * as React from 'react';
import { Router } from './router';
import { CookiesDialog } from './cookies-dialog';

export const App: React.FunctionComponent = () => {
  return (
    <>
      <h1>05-Testing / 01 React</h1>
      <Router />
      <CookiesDialog
        onAgreeClick={() => {
          console.log('Click agree');
        }}
      />
    </>
  );
};
