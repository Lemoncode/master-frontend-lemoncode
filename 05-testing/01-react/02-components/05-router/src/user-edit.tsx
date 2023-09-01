import React from 'react';
import { useParams } from 'react-router-dom';

type ParamProps = {
  name: string;
};

export const UserEdit: React.FC = (props) => {
  const params = useParams<ParamProps>();
  return <h1>User name: {params.name}</h1>;
};
