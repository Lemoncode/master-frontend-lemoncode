import { CarList, api, mapCarListFromApiToVm } from '#pods/car-list';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rent a car - Car list',
};

const CarListPage = async () => {
  // cache: 'force-cache' is the default value
  const carList = await api.getCarList({ cache: 'no-store' });
  console.log('Car list at build time:', { carList });

  return <CarList carList={mapCarListFromApiToVm(carList)} />;
};

export default CarListPage;
