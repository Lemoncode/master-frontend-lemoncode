import { ENV } from '#core/constants';
import { createServerFn } from '@tanstack/react-start';
import { Car } from './car-list.api-model';

const url = `${ENV.BASE_API_URL}/cars`;

export const getCarList = createServerFn().handler(
  async (): Promise<Car[]> =>
    await fetch(url).then((response) => response.json())
);
