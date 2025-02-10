import { createRouter, createHashHistory } from '@tanstack/react-router';
// The route-tree file is generated automatically. Do not modify this file manually.
import { routeTree } from './route-tree';

const history = createHashHistory();

export const router = createRouter({
  routeTree,
  history,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
