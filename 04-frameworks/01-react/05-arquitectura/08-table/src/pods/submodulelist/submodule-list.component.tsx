import React from 'react';
import { DashboardComponent, DashboardItemProps } from 'common/components';

interface Props {
  items: DashboardItemProps[];
}

export const SumoduleListComponent: React.FunctionComponent<Props> = props => {
  const { items } = props;
  return <DashboardComponent items={items} />;
};

/*
// Remove the previous code and uncomment this if you want to check how to add a
// custom style to the dashboard


import React from 'react';
import { DashboardComponent, DashboardItemProps } from 'common/components';
import { css } from '@emotion/css';

interface Props {
  items: DashboardItemProps[];
}

const itemStyle = css`
  background: red;
`;

export const SumoduleListComponent: React.FunctionComponent<Props> = props => {
  const { items } = props;
  return (
    <DashboardComponent items={items} classes={{ item: { root: itemStyle } }} />
  );
};

*/
