import React from 'react';
import { getNameCollection } from './name-api';

interface Props {
  initialNameCollection?: string[];
}

export const NameCollection: React.FunctionComponent<Props> = (props) => {
  const [nameCollection, setNameCollection] = React.useState(
    props.initialNameCollection || []
  );

  React.useEffect(() => {
    getNameCollection().then((names) => {
      setNameCollection(names);
    });
  }, []);

  return (
    <ul>
      {nameCollection.map((name) => (
        <li key={name}>{name}</li>
      ))}
    </ul>
  );
};
