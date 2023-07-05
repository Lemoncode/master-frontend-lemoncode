import { envConstants } from '@/_core/constants';
import { Car } from './car.api-model';

const url = `${envConstants.BASE_API_URL}/cars`;

export const getCar = async (id: string): Promise<Car> => {
  return await fetch(`${url}/${id}`).then((response) => response.json());
};

export const bookCar = async (car: Car): Promise<boolean> => {
  await fetch(`${url}/${car.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(car),
  });
  return true;
};
