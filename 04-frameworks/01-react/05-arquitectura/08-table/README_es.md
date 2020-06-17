# 08 Tabla

Vamos a mostrar una tabla de empleados desde la que vamos a permitir
ejecutar una serie de comandos.

# Pasos

- Copiate el ejemplo anterior _07-dashboard_ y haz un _npm install_

```bash
npm install
```

- Vamos a crearnos el pod para la lista de empleados.

_./src/pods/employee-list/employee-list.component.tsx_

```tsx
import React from 'react';

export const EmployeeListComponent: React.FunctionComponent = () => {
  return <h2>Hello from Employee list POD Component</h2>;
};
```

_./src/pods/employee-list/employee-list.container.tsx_

```tsx
import React from 'react';
import { EmployeeListComponent } from './employee-list.component';

export const EmployeeListContainer: React.FunctionComponent = () => {
  return (
    <>
      <h1>Hello from Employee list POD Container</h1>
      <EmployeeListComponent />
    </>
  );
};
```

- Vamos a crear un barrel:

_./src/pods/employee-list/index.ts_

```typescript
export * from './employee-list.container';
```

- Lo añadimos a nuestra escena:

_./src/scenes/employee-list.scene.tsx_

```diff
import React from 'react';
import { Link } from 'react-router-dom';
import { routes } from 'core/router';
import { AppLayout } from 'layouts';
+ import { EmployeeListContainer } from 'pods/employee-list';

export const EmployeeListScene: React.FC = () => {
  return (
    <AppLayout>
-      <h1>Employee list Scene!</h1>
-      <Link to={routes.editEmployee('232')}>Navigate to edit employee 232</Link>
+      <EmployeeListContainer>
    </AppLayout>
  );
};
```

- Ejecutamos y vemos que efectivamente se muestra el pod correcto en employee list:

```bash
npm start
```

- Para mostrar una lista de empleados vamos a necesitar un view model:

_./src/pods/employee-list/employee-list.vm.tsx_

```ts
export interface Employee {
  id: string;
  isActive: boolean;
  name: string;
  email: string;
  lastDateIncurred: string;
}
```

- Vamos a crear una API fake, ojo aquí podríamos tomar varios caminos.
  En este caso la API recibe model de API y usamos mappers (el contenedor
  es responsable de mapearlo).

Otra opción sería que la API usara internamente el modelo de API, pero
como parametros de entrada y salida el VM (quedando el mapping dentro de
la API.

Una tercera opción sería crear una API de modelo de API, y una API de Viewmodel
que se alimentara de la primera (usando mappers).

Cada aproximación tiene sus pros y sus cons.

En esta caso vamos a crear una API en memoría con la que podemos simular
operaciones de borrado e inserción.

_./src/pods/employee-list/api/employee-list.api-model.ts_

```ts
export interface Employee {
  id: string;
  isActive: boolean;
  name: string;
  email: string;
  lastDateIncurred: string;
}
```

_./src/pods/employee-list/api/employee-list.mock-data.ts_

```ts
import { Employee } from './employee-list.api-model';

export const mockEmployeeList: Employee[] = [
  {
    id: '1',
    isActive: true,
    name: 'Daniel Perez',
    email: 'daniel.perez@empresa.com',
    lastDateIncurred: '02/02/2020',
  },
  {
    id: '2',
    isActive: true,
    name: 'Jose Gomez',
    email: 'jose.gomez@empresa.com',
    lastDateIncurred: '05/02/2020',
  },
  {
    id: '3',
    isActive: false,
    name: 'Manuel Ruiz',
    email: 'manuel.ruiz@empresa.com',
    lastDateIncurred: '06/02/2020',
  },
  {
    id: '4',
    isActive: true,
    name: 'Ramón Gomez',
    email: 'ramon.gomez@empresa.com',
    lastDateIncurred: '02/05/2020',
  },
  {
    id: '5',
    isActive: false,
    name: 'María Lopez',
    email: 'maria.lopez@empresa.com',
    lastDateIncurred: '05/08/2020',
  },
  {
    id: '6',
    isActive: true,
    name: 'Manuel Ortiz',
    email: 'manuel.ortiz@empresa.com',
    lastDateIncurred: '06/06/2020',
  },
  {
    id: '7',
    isActive: false,
    name: 'David Martos',
    email: 'david.martos@empresa.com',
    lastDateIncurred: '14/08/2020',
  },
  {
    id: '8',
    isActive: true,
    name: 'Luz Roca',
    email: 'luz.roca@empresa.com',
    lastDateIncurred: '20/06/2020',
  },
];
```

_./src/pods/employee-list/api/employee-list.api.ts_

```ts
import { Employee } from './employee-list.api-model';
import { mockEmployeeList } from './employee-list.mock-data';

let employeeList = [...mockEmployeeList];

export const getEmployeeList = async (): Promise<Employee[]> => {
  return employeeList;
};

export const deleteEmployee = async (id: string): Promise<boolean> => {
  employeeList = employeeList.filter(e => e.id !== id);
  return true;
};
```

_./src/pods/employee-list/api/index.ts_

```ts
export * from './employee-list.api';
```

- Para poder usar la API en nuestro list container, debemos de convertir
  la entidad de API Model que genera a entidad de ViewModel, esto lo hacemos
  creando un mapper (una función que convierte de model de api de ViewModel y viceversa),
  ahora mismo son iguales estas entidades y esto va a ser directo, en el futuro con una
  API real podemos esperar cambios (encoding fechas, nombres de campos...), de esta manera
  localizamos estos posibles cambios en un sólo sitio y no impactan al resto del pod.

_./src/pods/employee-list/employee-list.mapper.ts_

```ts
import * as apiModel from './api/employee-list.api-model';
import * as viewModel from './employee-list.vm';

const mapEmployeeFromApiToVm = (
  employee: apiModel.Employee
): viewModel.Employee => ({
  ...employee,
});

export const mapEmployeeListFromApiToVm = (
  employeeList: apiModel.Employee[]
): viewModel.Employee[] => employeeList.map(e => mapEmployeeFromApiToVm(e));
```

- Vamos a hacer la carga de datos en el contenedor, y vamos a pasarlo al componente hijo:

_./src/pods/employee-list/employee-list.container.tsx_

```diff
import React from 'react';
import { EmployeeListComponent } from './employee-list.component';
+ import { Employee } from './employee-list.vm';
+ import { mapEmployeeListFromApiToVm } from './employee-list.mapper';
+ import { getEmployeeList } from './api';

export const EmployeeListContainer: React.FunctionComponent = () => {
+  const [employees, setEmployees] = React.useState<Employee[]>([]);
+
+  const onLoadEmployeeList = async () => {
+    const apiEmployeeList = await getEmployeeList();
+    const viewModelEmployeeList = mapEmployeeListFromApiToVm(apiEmployeeList);
+    setEmployees(viewModelEmployeeList);
+  };
+
+  React.useEffect(() => {
+    onLoadEmployeeList();
+  }, []);

  return (
    <>
      <h1>Hello from Employee list POD Container</h1>
-      <EmployeeListComponent />
+      <EmployeeListComponent employees={employees} />
    </>
  );
};
```

- En el componente hijo, vamos a mostrar estos datos

_./src/pods/employee-list/employee-list.component.tsx_

```diff
import React from 'react';
+ import { Employee } from './employee-list.vm';

+ interface Props {
+   employees : Employee[];
+ }

- export const EmployeeListComponent: React.FunctionComponent = () => {
+ export const EmployeeListComponent: React.FunctionComponent<Props> = ({
+  employees
+ }) => {

-  return <h2>Hello from Employee list POD Component</h2>;
+  return (
+      {employees.map(e => (
+        <li key={e.id}>{e.name}</li>
+      ))}
+  );
};
```

- Probamos y comprobamos que se muestran datos:

```bash
npm start
```

- Ahora vamos a mostrar esos datos en una tabla simple de material ui.

_./src/pods/employee-list/employee-list.component.tsx_

```diff
import React from 'react';
import { Employee } from './employee-list.vm';
+ import Table from '@material-ui/core/Table';
+ import TableBody from '@material-ui/core/TableBody';
+ import TableCell from '@material-ui/core/TableCell';
+ import TableContainer from '@material-ui/core/TableContainer';
+ import TableHead from '@material-ui/core/TableHead';
+ import TableRow from '@material-ui/core/TableRow';
+ import Checkbox from '@material-ui/core/Checkbox';
+ import IconButton from '@material-ui/core/IconButton';
+ import EditIcon from '@material-ui/icons/Edit';
+ import DeleteIcon from '@material-ui/icons/Delete';


interface Props {
  employees: Employee[];
}

export const EmployeeListComponent: React.FunctionComponent<Props> = ({
  employees,
}) => {
  return (
-    <ul>
-      {employees.map(e => (
-        <li key={e.id}>{e.name}</li>
-      ))}
-    </ul>
+    <TableContainer>
+      <Table>
+        <TableHead>
+          <TableRow>
+            <TableCell align="right">Activo</TableCell>
+            <TableCell align="right">Id</TableCell>
+            <TableCell align="right">Nombre</TableCell>
+            <TableCell align="right">Email</TableCell>
+            <TableCell align="right">Fecha último incurrido</TableCell>
+            <TableCell align="right">Comandos</TableCell>
+          </TableRow>
+        </TableHead>
+        <TableBody>
+          {employees.map((row) => (
+            <TableRow key={row.id}>
+              <TableCell component="th" scope="row">
+                <Checkbox checked={row.isActive} disabled />
+              </TableCell>
+              <TableCell align="right">{row.id}</TableCell>
+              <TableCell align="right">{row.name}</TableCell>
+              <TableCell align="right">{row.email}</TableCell>
+              <TableCell align="right">
+                {row.lastDateIncurred}
+              </TableCell>
+              <TableCell align="right">
+                <IconButton onClick={() => console.log('on Edit: ${row.id}')}>
+                  <EditIcon />
+                </IconButton>
+                <IconButton onClick={() => console.log('on Delete: ${row.id}')}>
+                  <DeleteIcon />
+                </IconButton>
+              </TableCell>
+            </TableRow>
+          ))}
+        </TableBody>
+      </Table>
+    </TableContainer>
  );
};
```

- Al pinchar en Edit queremos navegar a la página de edición de ese usuario:

- Vamonos al container y definir esta lógica:

_./src/pods/employee-list/employee-list.container.tsx_

```diff
import React from 'react';
import { EmployeeListComponent } from './employee-list.component';
import { Employee } from './employee-list.vm';
import { mapEmployeeListFromApiToVm } from './employee-list.mapper';
import { getEmployeeList } from './api';
+ import { useHistory } from 'react-router-dom';
+ import { routes } from 'core/router';

export const EmployeeListContainer: React.FunctionComponent = () => {
  const [employees, setEmployees] = React.useState<Employee[]>([]);
+ const history = useHistory();

  const onLoadEmployeeList = async () => {
    const apiEmployeeList = await getEmployeeList();
    const viewModelEmployeeList = mapEmployeeListFromApiToVm(apiEmployeeList);
    setEmployees(viewModelEmployeeList);
  };

  React.useEffect(() => {
    onLoadEmployeeList();
  }, []);

+ const handleEditEmployee = (id : string) => {
+  history.push(routes.editEmployee(id));
+ }

  return (
    <>
      <h1>Hello from Employee list POD Container</h1>
-      <EmployeeListComponent employees={employees} />
+      <EmployeeListComponent employees={employees} onEditEmployee={handleEditEmployee} />
    </>
  );
```

- Vamos al componente:

_./src/pods/employee-list/employee-list.component.tsx_

```diff
interface Props {
  employees: Employee[];
+ onEditEmployee : (id : string) => void;
}

export const EmployeeListComponent: React.FunctionComponent<Props> = ({
  employees,
+ onEditEmployee
}) => {

```

- Invocarlo en el click:

```diff
-  <IconButton onClick={() => console.log('on Edit: ${row.id}')}>
+  <IconButton onClick={() => onEditEmployee(row.id)}>

    <EditIcon />
  </IconButton>
```

- Hasta aquí bien, pero queremos añadir una sería de cosas:
  - Comandos.
  - Paginación.
  - Filtrado...
  - ...

Además todo esto se va a repetir en varias ventanas, así que en el
proyecto de admin origin hemos construido un asset de arquitectura:
https://github.com/Lemoncode/origin-front-admin

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End
guiado por un grupo de profesionales ¿Por qué no te apuntas a
nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria
con clases en vivo, como edición continua con mentorización, para
que puedas ir a tu ritmo y aprender mucho.

Y si tienes ganas de meterte una zambullida en el mundo _devops_
apuntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio)
