import { generatePath } from 'react-router-dom';

export const routes = {
  root: '/',
  login: '/login',
  hotelCollection: '/hotels',
  hotelEdit: '/hotels/:id',
};

export const linkRoutes = {
  ...routes,
  hotelEdit: id => generatePath(routes.hotelEdit, { id }),
};
