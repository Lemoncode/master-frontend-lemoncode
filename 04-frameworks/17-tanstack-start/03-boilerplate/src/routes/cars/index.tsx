import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';

const getCarList = async () =>
  await fetch('/api/cars').then((res) => res.json());

export const Route = createFileRoute('/cars/')({
  loader: () => getCarList(),
  component: RouteComponent,
  pendingComponent: () => <div>Loading cars...</div>,
});

function RouteComponent() {
  const navigate = useNavigate();
  const cars = Route.useLoaderData();

  return (
    <>
      <ul>
        {cars.map((car) => (
          <li key={car.id}>
            <Link to="/cars/$id" params={{ id: car.id }}>
              {car.name}
            </Link>
          </li>
        ))}
      </ul>
      <button onClick={() => navigate({ to: '/' })}>Go back to home</button>
    </>
  );
}
