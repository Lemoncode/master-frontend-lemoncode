'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { routeConstants } from '@/_core/constants';
import * as api from '../_api';
import * as viewModel from '../car.vm';
import classes from './car.module.css';
import { mapCarFromVmToApi } from '../car.mappers';

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
