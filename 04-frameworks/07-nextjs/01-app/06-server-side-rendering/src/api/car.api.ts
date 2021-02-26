import Axios from 'axios';
import { envConstants } from '../common/constants';
import { Car } from './car.api-model';

const url = `${envConstants.BASE_API_URL}/cars`;

export const getCarList = async (): Promise<Car[]> => {
  const { data } = await Axios.get<Car[]>(url);
  return data;
};

export const getCar = async (id: string): Promise<Car[]> => {
  const { data } = await Axios.get<Car[]>(`${url}/${id}`);
  return data;
};
