'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { routeConstants } from '#core/constants';
import * as api from './api';
import * as viewModel from './car.vm';
import { mapCarFromVmToApi } from './car.mappers';
import classes from './car.module.css';

interface Props {
  car: viewModel.Car;
}

export const Car: React.FC<Props> = (props) => {
  const { car } = props;
  const router = useRouter();

  const handleBook = async () => {
    try {
      const apiCar = mapCarFromVmToApi({ ...car, isBooked: !car.isBooked });
      await api.bookCar(apiCar);
      router.push(routeConstants.carList);
    } catch (error) {
      console.error({ error });
    }
  };

  return (
    <div className={classes.root}>
      <h2 className={classes.name}>{car.name}</h2>
      <Image
        className={classes.image}
        alt={car.name}
        src={car.imageUrl}
        width={350}
        height={200}
      />
      <ul className={classes.features}>
        {car.features.map((feature) => (
          <li key={feature}>
            <h3>{feature}</h3>
          </li>
        ))}
      </ul>
      <button
        className={`${classes.book} ${
          car.isBooked ? classes.secondary : classes.primary
        }`}
        onClick={handleBook}
      >
        {car.isBooked ? 'Descartar reserva' : 'Reservar'}
      </button>
    </div>
  );
};
