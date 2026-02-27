import { api, CarList, mapCarListFromApiToVm } from '#pods/car-list';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/cars/')({
  head: () => ({
    meta: [{ title: 'Rent a car - Car list' }],
  }),
  loader: () => api.getCarList(),
  component: RouteComponent,
});

function RouteComponent() {
  const cars = Route.useLoaderData();

  return <CarList carList={mapCarListFromApiToVm(cars)} />;
}
