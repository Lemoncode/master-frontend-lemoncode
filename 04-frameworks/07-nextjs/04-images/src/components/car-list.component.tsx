import React from 'react';
import * as classes from './car-list.styles';

export const CarListComponent: React.FunctionComponent = (props) => {
  return (
    <ul className={classes.root}>
      <li>Audi Q8</li>
      <li>BMW X7</li>
    </ul>
  );
};
