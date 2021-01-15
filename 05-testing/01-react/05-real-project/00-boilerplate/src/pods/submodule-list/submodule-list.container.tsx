import React from 'react';
import { SumoduleListComponent } from './submodule-list.component';
import { DashboardItemProps } from 'common/components';
import { routes } from 'core/router';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import GroupIcon from '@material-ui/icons/Group';

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
