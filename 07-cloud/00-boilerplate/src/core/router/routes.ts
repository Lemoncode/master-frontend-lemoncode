import { generatePath } from 'react-router-dom';

interface BaseRoutes {
  root: string;
  list: string;
}

const baseRoutes: BaseRoutes = {
  root: '/',
  list: '/list',
};

type SwitchRoutes = BaseRoutes;

export const switchRoutes: SwitchRoutes = {
  ...baseRoutes,
};

type LinkRoutes = BaseRoutes;

export const linkRoutes: LinkRoutes = {
  ...baseRoutes,
};
