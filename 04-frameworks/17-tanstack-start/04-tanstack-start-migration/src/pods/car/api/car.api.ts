import { ENV } from '#core/constants';
import { createServerFn } from '@tanstack/react-start';
import { Car } from './car.api-model';

const url = `${ENV.BASE_API_URL}/cars`;

export const getCar = createServerFn()
  .inputValidator((data: { id: string }) => data)
  .handler(
    async ({ data }): Promise<Car> =>
      await fetch(`${url}/${data.id}`).then((response) => response.json())
  );

export const bookCar = createServerFn({ method: 'POST' })
  .inputValidator((car: Car) => car)
  .handler(async ({ data }): Promise<boolean> => {
    await fetch(`${url}/${data.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return true;
  });
