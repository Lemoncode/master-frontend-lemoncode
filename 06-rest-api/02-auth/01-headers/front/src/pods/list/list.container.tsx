import React from 'react';

interface Props {
  className?: string;
}

export const ListContainer: React.FunctionComponent<Props> = (props) => {
  const { className } = props;

  return <div className={className}>List container</div>;
};
