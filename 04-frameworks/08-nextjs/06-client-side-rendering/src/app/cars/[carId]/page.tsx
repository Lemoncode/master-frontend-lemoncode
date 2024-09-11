import React from 'react';
import { Metadata } from 'next';
import { Car, api, mapCarFromApiToVm } from '#pods/car';

interface Props {
  params: { carId: string };
}

export const generateMetadata = async (props: Props): Promise<Metadata> => {
  const { params } = props;
  const car = await api.getCar(params.carId, { cache: 'no-store' }); // Check 'force-cache' too

  return {
    title: `Rent a car - Car ${car.name} details`,
  };
};

const CarPage = async (props: Props) => {
  const { params } = props;
  const car = await api.getCar(params.carId, { cache: 'no-store' }); // Check 'force-cache' too
  console.log('Car page', car);

  return <Car car={mapCarFromApiToVm(car)} />;
};

export default CarPage;
