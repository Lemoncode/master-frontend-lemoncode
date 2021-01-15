import * as React from 'react';
import { Display } from './display';
import { Edit } from './edit';

export const NameEdit: React.FunctionComponent = () => {
  const [userName, setUserName] = React.useState('');

  return (
    <>
      <Display userName={userName} />
      <Edit userName={userName} onSetUserName={setUserName} />
    </>
  );
};
