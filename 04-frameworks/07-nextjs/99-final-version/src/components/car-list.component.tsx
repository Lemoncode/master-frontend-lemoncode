import React from 'react';
import { Car } from '../models';
import { CarItem } from './car-item.component';
import * as classes from './car-list.styles';

interface Props {
  carList: Car[];
}

export const CarListComponent: React.FunctionComponent<Props> = (props) => {
  const { carList } = props;

  return (
    <ul className={classes.root}>
      {carList.map((car) => (
        <li key={car.id}>
          <CarItem car={car} />
        </li>
      ))}
    </ul>
  );
};
