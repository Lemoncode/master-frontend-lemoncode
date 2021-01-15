import * as React from 'react';

export const useName = () => {
  const [name, setName] = React.useState('John Doe');

  return {
    name,
    setName,
  };
};
