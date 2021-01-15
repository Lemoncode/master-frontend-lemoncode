import React from 'react';
import {
  TabComponent,
  TabListComponent,
  TabPanelComponent,
} from 'common/components';
import AppBar from '@material-ui/core/AppBar';
import { DataComponent } from './components';
import { Employee } from './employee.vm';

interface Props {
  employee: Employee;
  onSave: (employee: Employee) => void;
  onCancel: () => void;
}

export const EmployeeComponent: React.FunctionComponent<Props> = ({
  employee,
  onSave,
  onCancel,
}) => {
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
        <DataComponent
          employee={employee}
          onSave={onSave}
          onCancel={onCancel}
        />
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
