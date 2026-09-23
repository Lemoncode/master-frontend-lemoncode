import { routeConstants } from '#core/constants';
import Link from 'next/link';
import React from 'react';
import { Car } from '../car-list.vm';
import classes from './car-item.module.css';

interface Props {
  car: Car;
}

export const CarItem: React.FC<Props> = (props) => {
  const { car } = props;

  return (
    <Link href={routeConstants.car(car.id)} className={classes.root}>
      <h2 className={classes.title}>
        {car.isBooked ? (
          <span className="material-icon" style={{ color: '#d32f2f' }}>
            cancel
          </span>
        ) : (
          <span className="material-icon" style={{ color: '#2e7d32' }}>
            check_circle
          </span>
        )}
        <span>{car.name}</span>
      </h2>
      <img className={classes.image} src={car.imageUrl} alt={car.name} />
    </Link>
  );
};
