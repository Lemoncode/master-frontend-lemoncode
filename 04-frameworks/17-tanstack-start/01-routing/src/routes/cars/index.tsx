import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/cars/')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  return (
    <>
      <div>Hello "/cars"!</div>
      <Link to="/cars/$id" params={{ id: '1' }}>
        Navigate to car 1
      </Link>
      <button onClick={() => navigate({ to: '/' })}>Go back to home</button>
    </>
  );
}
