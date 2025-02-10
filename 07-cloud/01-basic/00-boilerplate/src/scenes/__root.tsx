import React from 'react';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '#core/router';

export const Route = createRootRouteWithContext()({
  component: () => {
    return (
      <>
        <Outlet />
        <React.Suspense>
          <TanStackRouterDevtools />
        </React.Suspense>
      </>
    );
  },
});
