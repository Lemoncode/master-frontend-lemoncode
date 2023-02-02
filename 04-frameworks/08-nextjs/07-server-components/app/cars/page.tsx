import { CarListContainer, api } from '../pods/car-list';

// cache: 'force-cache' SSG
// next { revalidate: } ISR
// cache: 'no-store' SSR

const CarListPage = async () => {
  const carList = await api.getCarList({ cache: 'no-store' });
  console.log('Car list build time', { carList });
  return <CarListContainer carList={carList} />;
};

export default CarListPage;
