import React from 'react';
import {
  TabComponent,
  TabListComponent,
  TabPanelComponent,
} from 'common/components';
import AppBar from '@material-ui/core/AppBar';

export const EmployeeComponent: React.FunctionComponent = () => {
  const [tab, setTab] = React.useState(0);
  return (
    <>
      <AppBar position="static">
        <TabListComponent value={tab} onChange={setTab}>
          <TabComponent label="Datos" />
          <TabComponent label="Proyectos" />
          <TabComponent label="Informes" />
        </TabListComponent>
      </AppBar>
      <TabPanelComponent value={tab} index={0}>
        <h3>Hello from Data tab</h3>
      </TabPanelComponent>
      <TabPanelComponent value={tab} index={1}>
        <h3>Hello from projects tab</h3>
      </TabPanelComponent>
      <TabPanelComponent value={tab} index={2}>
        <h3>Hello from report tab</h3>
      </TabPanelComponent>
    </>
  );
};
