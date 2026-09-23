import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/cars')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <div style={{ background: 'teal' }}>Common layout</div>
      <Outlet />
    </>
  );
}
