import React from 'react';
import { Metadata } from 'next';
import { getCar } from './_api';
import { Car } from './_components';
import { mapCarFromApiToVm } from './car.mappers';

interface Props {
  params: { carId: string };
}

export const generateMetadata = async (props: Props): Promise<Metadata> => {
  const { params } = props;
  const car = await getCar(params.carId);
  return {
    title: `Rent a car - Car ${car.name} details`,
  };
};

export async function generateStaticParams() {
  return [{ carId: '1' }, { carId: '2' }, { carId: '3' }];
}

const CarPage = async (props: Props) => {
  const { params } = props;
  const car = await getCar(params.carId);
  console.log('Car page', car);

  return <Car car={mapCarFromApiToVm(car)} />;
};

export default CarPage;
