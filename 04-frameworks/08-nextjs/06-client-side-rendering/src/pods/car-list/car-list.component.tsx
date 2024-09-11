import React from 'react';
import { Car } from './car-list.vm';
import { CarItem } from './components';
import classes from './car-list.module.css';

interface Props {
  carList: Car[];
}

export const CarList: React.FC<Props> = (props) => {
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
