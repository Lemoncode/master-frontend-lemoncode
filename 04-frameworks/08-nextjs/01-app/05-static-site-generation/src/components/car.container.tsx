import React from 'react';
import { useRouter } from 'next/router';
import * as api from '../api';
import { routeConstants } from '../common/constants';
import { mapCarFromApiToVm } from '../mappers';
import { CarComponent } from './car.component';

interface Props {
  car: api.Car;
}

export const CarContainer: React.FunctionComponent<Props> = (props) => {
  const router = useRouter();
  const car = mapCarFromApiToVm(props.car);
  const handleBook = async () => {
    // TODO: Book a car
    router.push(routeConstants.carList);
  };

  return <CarComponent car={car} onBook={handleBook} />;
};
