import { ENV } from '#core/constants';
import { Car } from './car-list.api-model';

const url = `${ENV.BASE_API_URL}/cars`;

export const getCarList = async (): Promise<Car[]> =>
  await fetch(url).then((response) => response.json());
