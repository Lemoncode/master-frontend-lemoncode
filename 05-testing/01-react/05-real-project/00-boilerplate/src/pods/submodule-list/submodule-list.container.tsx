import React from 'react';
import {
  AccountBalance as AccountBalanceIcon,
  Group as GroupIcon,
} from '@mui/icons-material';
import { SumoduleListComponent } from './submodule-list.component';
import { DashboardItemProps } from 'common/components';
import { routes } from 'core/router';

export const SubmoduleListContainer: React.FunctionComponent = () => {
  const items: DashboardItemProps[] = React.useMemo(
    (): DashboardItemProps[] => [
      {
        title: 'Proyectos',
        linkTo: routes.projects,
        icon: AccountBalanceIcon,
      },
      {
        title: 'Empleados',
        linkTo: routes.employees,
        icon: GroupIcon,
      },
    ],
    []
  );

  return <SumoduleListComponent items={items} />;
};
