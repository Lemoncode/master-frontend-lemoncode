import { generatePath } from "react-router-dom";

interface SwitchRoutes {
  root: string;
  editEmail: string;
  movementList: string;
}

export const switchRoutes: SwitchRoutes = {
  root: "/",
  editEmail: "/edit-email",
  movementList: "/movement-list/:id",
};

interface Routes {
  root: string;
  editEmail: string;
  movementList: (id: string) => string;
}

export const routes: Routes = {
  ...switchRoutes,
  movementList: (id) => generatePath(switchRoutes.movementList, { id }),
};
