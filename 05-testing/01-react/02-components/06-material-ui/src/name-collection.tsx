import React from 'react';
import { Link } from 'react-router-dom';
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
        <li key={name}>
          <Link to={`/users/${name}`}>{name}</Link>
        </li>
      ))}
    </ul>
  );
};
