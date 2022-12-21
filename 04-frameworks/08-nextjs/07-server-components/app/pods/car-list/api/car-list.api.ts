import { envConstants } from 'core/constants';
import { Car } from './car-list.api-model';

const url = `${envConstants.BASE_API_URL}/cars`;

export const getCarList = async (options?: RequestInit): Promise<Car[]> => {
  return await fetch(url, options).then((response) => response.json());
};
