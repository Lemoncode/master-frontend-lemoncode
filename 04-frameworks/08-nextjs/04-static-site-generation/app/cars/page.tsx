import React from 'react';
import { Metadata } from 'next';
import { getCarList } from './_api';
import { CarList } from './_components';
import { mapCarListFromApiToVm } from './car-list.mappers';

export const metadata: Metadata = {
  title: 'Rent a car - Car list',
};

const CarListPage = async () => {
  // cache: 'force-cache' is the default
  const carList = await getCarList({ next: { revalidate: 10 } }); // In seconds
  console.log('Car list at build time:', { carList });

  return <CarList carList={mapCarListFromApiToVm(carList)} />;
};

export default CarListPage;
