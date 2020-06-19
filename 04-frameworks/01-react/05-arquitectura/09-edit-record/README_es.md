# 09 Edit Record

Vamos a editar un empleado.

# Pasos

- Copiate el ejemplo anterior _08-table_ y haz un _npm install_

```bash
npm install
```

- Vamos a definir el pod de _employee_

_./src/pods/employee/employee.component.tsx_

```tsx
import React from 'react';

export const EmployeeComponent: React.FunctionComponent = () => {
  return <h2>Hello from Employee Component</h2>;
};
```

_./src/pods/employee/employee.container.tsx_

```tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { EmployeeComponent } from './employee.component';

export const EmployeeContainer: React.FunctionComponent = () => {
  const { id } = useParams();

  return (
    <>
      <h1>{id}</h1>
      <EmployeeComponent />
    </>
  );
};
```

_./src/pods/employee/index.ts_

```tsx
export * from './employee.container';
```

_./src/scenes/employee.scene.tsx_

```diff
import React from 'react';
import { Link } from 'react-router-dom';
import { routes } from 'core/router';
import { AppLayout } from 'layouts';
+ import { EmployeeContainer } from 'pods/employee';

export const EmployeeScene: React.FC = () => {
  return (
    <AppLayout>
-      <h1>Employee Scene!</h1>
-      <Link to={routes.employees}>Back to employee list</Link>
+      <EmployeeContainer/>
    </AppLayout>
  );
};
```

- Vamos arrancar y ver que se muestra el pod:

```bash
npm start
```

- Ahora toca montarnos la definicion de datos para la vista:

_./src/pods/employee/employee.vm.ts_

```ts
export interface Employee {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  temporalPassword?: string;
  projects: ProjectSummary[];
}

export interface ProjectSummary {
  id: string;
  isAssigned?: boolean;
  projectName: string;
}

export const createEmptyEmployee = (): Employee => ({
  id: '',
  name: '',
  email: '',
  isActive: false,
  temporalPassword: '',
  projects: [],
});
```

- Y vamos a definir una API mock:

_./api/employee.api.model.ts_

```ts
export interface Employee {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  temporalPassword?: string;
  projects?: ProjectSummary[];
}

export interface ProjectSummary {
  id: string;
  isAssigned?: boolean;
  projectName: string;
}
```

_./api/employee.mock-data.ts_

```ts
import { Employee, ProjectSummary } from './employee.api.model';

const mockProjectSummaryList: ProjectSummary[] = [
  {
    id: '1',
    isAssigned: true,
    projectName: 'Mapfre',
  },
  {
    id: '2',
    isAssigned: false,
    projectName: 'Bankia',
  },
  {
    id: '3',
    isAssigned: false,
    projectName: 'Vacaciones',
  },
  {
    id: '4',
    isAssigned: true,
    projectName: 'Baja',
  },
];

export const mockEmployee: Employee = {
  id: '1',
  name: 'Prueba Nombre',
  email: 'prueba@email.com',
  isActive: true,
  temporalPassword: 'admin',
  projects: mockProjectSummaryList,
};
```

_./api/employee.api.ts_

```ts
import { Employee } from './employee.api.model';
import { mockEmployee } from './employee.mock-data';

export const getEmployeeById = async (id: string): Promise<Employee> => {
  return mockEmployee;
};
```

_./api/index.ts_

```ts
export * from './employee.api';
export * from './employee.api.model';
```

- Para manejarnos con los tabs, hemos hecho unos wrappers para ahorrar
  código y no tener que repetir código cuando creemos estos tabs:

_/common/components/tabs/tab-list.component.tsx_

```tsx
import React from 'react';
import Tabs, { TabsProps } from '@material-ui/core/Tabs';

interface Props extends Omit<TabsProps, 'onChange'> {
  value: number;
  onChange: (value: number) => void;
}

export const TabListComponent: React.FunctionComponent<Props> = props => {
  const { value, onChange, ...otherProps } = props;

  const handleChange = (event, value) => {
    onChange(value);
  };

  return <Tabs {...otherProps} onChange={handleChange} value={value} />;
};
```

_/common/components/tabs/tab-panel.component.tsx_

```tsx
import React from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

interface Props {
  index: number;
  value: any;
}

export const TabPanelComponent: React.FunctionComponent<Props> = props => {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      {...other}
    >
      {value === index && children}
    </Typography>
  );
};
```

_/common/components/tabs/tab.component.tsx_

```tsx
import * as React from 'react';
import Tab, { TabProps } from '@material-ui/core/Tab';

type Props = TabProps;

export const TabComponent: React.FunctionComponent<Props> = props => {
  const { ...otherProps } = props;

  return <Tab {...otherProps} />;
};
```

_/common/components/tabs/index.ts_

```ts
export * from './tab-panel.component';
export * from './tab.component';
export * from './tab-list.component';
```

_/common/components/index.ts_

```diff
export * from './form';
export * from './dashboard';
+ export * from './tabs';
```

- Vamos a definir los diferentes tabs:

_./src/pods/employee/employee.component.tsx_

```diff
import React from 'react';
+ import {
+  TabComponent,
+  TabListComponent,
+  TabPanelComponent,
+ } from 'common/components';
+ import AppBar from '@material-ui/core/AppBar';

export const EmployeeComponent: React.FunctionComponent = () => {
-  return <h2>Hello from Employee Component</h2>;
+  const [tab, setTab] = React.useState(0);
+  return (
+    <>
+      <AppBar position="static">
+         <TabListComponent value={tab} onChange={setTab}>
+          <TabComponent label="Datos" />
+          <TabComponent label="Proyectos" />
+          <TabComponent label="Informes" />
+        </TabListComponent>
+      </AppBar>
+      <TabPanelComponent value={tab} index={0}>
+         <h3>Hello from Data tab</h3>
+      </TabPanelComponent>
+      <TabPanelComponent value={tab} index={1}>
+         <h3>Hello from projects tab</h3>
+      </TabPanelComponent>
+      <TabPanelComponent value={tab} index={2}>
+         <h3>Hello from report tab</h3>
+      </TabPanelComponent>
+    </>
+  );
};
```

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End
guiado por un grupo de profesionales ¿Por qué no te apuntas a
nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria
con clases en vivo, como edición continua con mentorización, para
que puedas ir a tu ritmo y aprender mucho.

Y si tienes ganas de meterte una zambullida en el mundo _devops_
apuntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio)
