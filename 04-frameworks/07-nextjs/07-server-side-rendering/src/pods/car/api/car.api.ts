import Axios from 'axios';
import { envConstants } from 'core/constants';
import { Car } from './car.api-model';

const url = `${envConstants.BASE_API_URL}/cars`;

export const getCar = async (id: string): Promise<Car[]> => {
  const { data } = await Axios.get<Car[]>(`${url}/${id}`);
  return data;
};

export const bookCar = async (car: Car): Promise<boolean> => {
  await Axios.put(`${url}/${car.id}`, car);
  return true;
};
