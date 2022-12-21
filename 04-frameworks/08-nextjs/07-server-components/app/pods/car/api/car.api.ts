import Axios from 'axios';
import { envConstants } from 'core/constants';
import { Car } from './car.api-model';

const url = `${envConstants.BASE_API_URL}/cars`;

export const getCar = async (
  id: string,
  options?: RequestInit
): Promise<Car> => {
  return await fetch(`${url}/${id}`, options).then((response) =>
    response.json()
  );
};

export const bookCar = async (car: Car): Promise<boolean> => {
  await Axios.put(`${url}/${car.id}`, car);
  return true;
};
