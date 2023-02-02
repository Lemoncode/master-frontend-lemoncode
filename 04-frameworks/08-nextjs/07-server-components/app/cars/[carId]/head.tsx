import { api } from '../../pods/car';

interface Props {
  params: { carId: string };
}

const CarHead = async (props: Props) => {
  const { params } = props;
  const car = await api.getCar(params?.carId);
  console.log('Get car from Head');

  return <title>Rent a car - Car {car?.name} details</title>;
};

export default CarHead;
