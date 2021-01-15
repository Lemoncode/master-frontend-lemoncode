# 09 Edit Record - Implemented

Implementación paso a paso de la edición de un empleado.

# Pasos

Arrancamos del ejemplo 09A-edit-record-start, este ejemplo ya
tiene incluidos una serie de componetes genericos y reusables.

- Haz un _npm install_

```bash
npm install
```

- Lo que queremos implementar lo puedes ver en el mock de baja fidelidad.

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

- Vamos ahora a definir los tabs de este formulario, para ellos
  hemos creado unos wrappers del componente de tab de material ui,
  vamos a hacer uso de ellos.

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

vampos a por el tab de data

_./src/pods/employee/components/data.component.tsx_

```tsx
import React from 'react';
import { Formik, Form } from 'formik';
import { TextFieldComponent, CheckboxComponent } from 'common/components';
import { cx } from 'emotion';

export const DataComponent: React.FunctionComponent = () => {
  return (
    <Formik
      initialValues={employee}
      enableReinitialize={true}
      onSubmit={onSave}
    >
      {() => (
        <Form>
          <TextFieldComponent
            label="Id"
            name="id"
            InputProps={{
              readOnly: true,
            }}
          />
          <TextFieldComponent label="Nombre" name="name" />
          <TextFieldComponent label="Email" name="email" />
          <CheckboxComponent name="isActive" label="Activo" color="primary" />
        </Form>
      )}
    </Formik>
  );
};
```

- Creamos un barrel

_./src/pods/employee/components/index.ts_

```ts
export * from './data.component';
```

- Vamos a usar este data component en el tab:

_./src/pods/employee/components/employee.component.tsx_

```diff
import React from 'react';
import {
  TabComponent,
  TabListComponent,
  TabPanelComponent,
} from 'common/components';
import AppBar from '@material-ui/core/AppBar';
+ import { DataComponent } from './components';
```

```diff
      <TabPanelComponent value={tab} index={0}>
+        <DataComponent/>
-        <h3>Hello from Data tab</h3>
      </TabPanelComponent>
```

- Necesitamos alimentar a DataComponent las siguientes propiedades:

  - Los datos del empleado.
  - El comando Save y el cancel.

- Vamos a ello:

_./src/pods/employee/components/employee.component.tsx_

```diff
import { DataComponent } from './components';
+ import { Employee } from './employee.vm';

+ interface Props {
+  employee: Employee;
+  onSave: (employee: Employee) => void;
+  onCancel: () => void;
+ }

- export const EmployeeComponent: React.FunctionComponent = () => {
+ export const EmployeeComponent: React.FunctionComponent<Props> = ({
+ employee,
+ onSave,
+ onCancel
+ }) => {
```

```diff
      <TabPanelComponent value={tab} index={0}>
-        <DataComponent />
+        <DataComponent
+          employee={employee}
+          onSave={onSave}
+          onCancel={onCancel}
+        />
      </TabPanelComponent>
```

- Ahora tenemos que añadir la lógica en el container.

- Antes de meternos con el container, nos hace falta
  un mapeador para convertir de modelo de api a vm:

_./src/pods/employee/employee.mapper.ts_

```ts
import * as apiModel from './api/employee.api.model';
import * as viewModel from './employee.vm';

const mapProjectSummaryFromApiToVm = (
  projectSummary: apiModel.ProjectSummary
): viewModel.ProjectSummary => ({
  ...projectSummary,
});

const mapProjectSummaryListFromApiToVm = (
  projectSummaryCollection: apiModel.ProjectSummary[]
): viewModel.ProjectSummary[] =>
  projectSummaryCollection.map(mapProjectSummaryFromApiToVm);

export const mapEmployeeFromApiToVm = (
  employee: apiModel.Employee
): viewModel.Employee => {
  return Boolean(employee)
    ? {
        ...employee,
        projects: mapProjectSummaryListFromApiToVm(employee.projects),
      }
    : viewModel.createEmptyEmployee();
};
```

_./src/pods/employee/components/employee.container.tsx_

```diff
import React from 'react';
import { useParams } from 'react-router-dom';
import { EmployeeComponent } from './employee.component';
+ import {
+  Employee,
+  createEmptyEmployee,
+ } from './employee.vm';
+ import { getEmployeeById } from './api';
+ import { mapEmployeeFromApiToVm } from './employee.mapper';


export const EmployeeContainer: React.FunctionComponent = () => {
  const { id } = useParams();
+  const [employee, setEmployee] = React.useState<Employee>(
+    createEmptyEmployee()
+  );

+  const onLoadEmployee = async () => {
+      const apiEmployee = await getEmployeeById(id);
+      const viewModelEmployee = mapEmployeeFromApiToVm(apiEmployee)
+      setEmployee(viewModelEmployee);
+  };

+  React.useEffect(() => {
+    onLoadEmployee();
+  }, []);

+  const handleSave = (employee: Employee) => {
+    console.log('Guardado');
+  };
+
+  const handleCancel = () => {
+    history.back();
+  };

  return (
    <>
      <h1>{id}</h1>
      <EmployeeComponent
+        employee={employee}
+        onSave={handleSave}
+        onCancel={handleCancel}
      />
    </>
  );
};
```

- Para poner los botones de comandos en cada tab (grabar, etc...)
  haremos uso de un componente footer genérico que hemos creado:

_./src/pods/employee/components/data.component.tsx_

```diff
import { Employee } from '../employee.vm';
+ import { CommandFooterComponent } from 'common-app/command-footer';
```

```diff
    <TextFieldComponent label="Email" name="email" />
    <CheckboxComponent name="isActive" label="Activo" color="primary" />
+    <CommandFooterComponent
+      onCancel={onCancel}
+    />
  </Form>
```

- Probamos que el tab se ve correctamente

```bash
npm start
```

- Vamos ahora a definir las validaciones:

_./src/pods/employee/components/data.validation.ts_

```tsx
import { ValidationSchema, Validators } from '@lemoncode/fonk';
import { createFormikValidation } from '@lemoncode/fonk-formik';

export const validationSchema: ValidationSchema = {
  field: {
    name: [Validators.required],
    email: [
      {
        validator: Validators.required,
      },
      {
        validator: Validators.email,
      },
    ],
  },
};

export const formValidation = createFormikValidation(validationSchema);
```

- Y a darle uso:

_./src/pods/employee/components/data.component.tsx_

```diff
import { Employee } from '../employee.vm';
+ import { formValidation } from './data.validation';

```

_./src/pods/employee/components/data.component.tsx_

```diff
  <Form
      initialValues={employee}
      onSubmit={onSave}
+      validate={formValidation.validateForm}
  >
```

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End
guiado por un grupo de profesionales ¿Por qué no te apuntas a
nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria
con clases en vivo, como edición continua con mentorización, para
que puedas ir a tu ritmo y aprender mucho.

Y si tienes ganas de meterte una zambullida en el mundo _devops_
apuntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio)
