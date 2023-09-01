import React from 'react';
import { getNameCollection } from './name-api';

export const NameCollection: React.FC = () => {
  const [nameCollection, setNameCollection] = React.useState([]);

  React.useEffect(() => {
    getNameCollection().then((names) => {
      setNameCollection(names);
    });
  }, []);

  return (
    <ul>
      {nameCollection.length === 0 ? (
        <span>No data to display</span>
      ) : (
        nameCollection.map((name) => <li key={name}>{name}</li>)
      )}
    </ul>
  );
};
