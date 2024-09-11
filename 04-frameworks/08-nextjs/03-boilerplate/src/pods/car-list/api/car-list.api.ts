import { envConstants } from '#core/constants';
import { Car } from './car-list.api-model';

const url = `${envConstants.BASE_API_URL}/cars`;

export const getCarList = async (): Promise<Car[]> => {
  return await fetch(url).then((response) => response.json());
};
