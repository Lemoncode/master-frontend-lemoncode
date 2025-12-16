import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/cars/$id')({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  return <div>Car id={id}</div>;
}
