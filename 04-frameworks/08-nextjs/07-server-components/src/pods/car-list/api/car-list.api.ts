import Axios from 'axios';
import { envConstants } from 'core/constants';
import { Car } from './car-list.api-model';

const url = `${envConstants.BASE_API_URL}/cars`;

export const getCarList = async (): Promise<Car[]> => {
  const { data } = await Axios.get<Car[]>(url);
  return data;
};
