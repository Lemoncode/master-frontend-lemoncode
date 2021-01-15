import { generatePath } from 'react-router-dom';

interface SwitchRoutes {
  root: string;
  student: string;
  trainer: string;
}

export const switchRoutes: SwitchRoutes = {
  root: '/',
  student: '/student/:room',
  trainer: '/trainer/:room/:token',
};

interface Routes extends Omit<SwitchRoutes, 'student' | 'trainer'> {
  student: (room: string) => string;
  trainer: (room: string, token: string) => string;
}

export const routes: Routes = {
  ...switchRoutes,
  student: room => generatePath(switchRoutes.student, { room }),
  trainer: (room, token) => generatePath(switchRoutes.trainer, { room, token }),
};
