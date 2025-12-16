import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <div>Hello "/"!</div>
      <Link to="/cars">Navigate to car list</Link>
    </>
  );
}
