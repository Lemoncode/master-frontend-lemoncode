import { CarContainer, api } from '../../pods/car';

interface Props {
  params: { carId: string };
}

const CarPage = async (props: Props) => {
  const { params } = props;
  const car = await api.getCar(params?.carId, { cache: 'no-store' });
  console.log('Get car from Page');

  return <CarContainer car={car} />;
};

export default CarPage;
