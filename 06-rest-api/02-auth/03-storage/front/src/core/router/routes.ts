interface BaseRoutes {
  root: string;
  login: string;
  list: string;
}

const baseRoutes: BaseRoutes = {
  root: '/',
  login: '/login',
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
