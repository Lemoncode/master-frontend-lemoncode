import React from 'react';

interface Props {
  userName: string;
}

export const Display: React.FunctionComponent<Props> = (props) => {
  const { userName } = props;

  return <h3>{userName}</h3>;
};
