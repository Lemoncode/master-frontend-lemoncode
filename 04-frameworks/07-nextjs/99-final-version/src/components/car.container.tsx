import React from 'react';
import { useRouter } from 'next/router';
import * as api from '../api';
import { routeConstants } from '../common';
import { mapCarFromApiToVm, mapCarFromVmToApi } from '../mappers';
import { CarComponent } from './car.component';

interface Props {
  car: api.Car;
}

export const CarContainer: React.FunctionComponent<Props> = (props) => {
  const router = useRouter();
  const car = mapCarFromApiToVm(props.car);
  const handleBook = async () => {
    try {
      const apiCar = mapCarFromVmToApi({ ...car, isBooked: !car.isBooked });
      await api.bookCar(apiCar);
      router.push(routeConstants.root);
    } catch (error) {
      console.error({ error });
    }
  };

  return <CarComponent car={car} onBook={handleBook} />;
};
