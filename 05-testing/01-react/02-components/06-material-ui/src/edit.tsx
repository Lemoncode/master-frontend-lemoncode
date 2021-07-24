import React from 'react';

interface Props {
  userName: string;
  onSetUserName: (userName: string) => void;
}

export const Edit: React.FunctionComponent<Props> = (props) => {
  const { userName, onSetUserName } = props;

  return (
    <input value={userName} onChange={(e) => onSetUserName(e.target.value)} />
  );
};
