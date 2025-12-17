import { api, Car, mapCarFromApiToVm } from '#pods/car';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/cars/$id')({
  loader: ({ params }) => api.getCar(params.id),
  head: ({ loaderData }) => ({
    meta: [{ title: `Rent a car - Car ${loaderData?.name} details` }],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const car = Route.useLoaderData();
  return <Car car={mapCarFromApiToVm(car)} />;
}
