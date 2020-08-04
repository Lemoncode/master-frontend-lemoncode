import * as React from 'react';
import { Router } from './router';
import { CardComponent } from './card';

export const App: React.FunctionComponent = () => {
  return (
    <>
      <h1>05-Testing / 01 React</h1>
      <Router />
      <CardComponent
        title="Card title"
        body="Card body"
        onClick={console.log}
      />
    </>
  );
};
