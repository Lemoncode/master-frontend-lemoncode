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

- Hasta aquí bien, pero queremos añadir una sería de cosas:
  - Comandos.
  - Paginación.
  - Filtrado...
  - ...

Además todo esto se va a repetir en varias ventanas, así que hemos
construido un wrapper de tabla que implementa el caso común
que vamos a tener en nuestra aplicación:

- Para tener paginación custom nos instalamos los laboratorios
  de material-ui (un componente de UI).

```bash
npm install @material-ui/lab --save
```

- Para tener algoritmos y ayudas de filtrado, paginación.. vamos a usar
  _react-table_

```bash
npm install react-table --save
```

- Para no llevarnos mucho tiempo vamos a copiar los fichero comunes
  de tabla que usamos (en el proyecto original debajo de common/table).Este asset es candidato a ser promovido a librería (tableCrud).

Veamos el contrato que expone el contenedor:

```ts
interface Props<T = {}> {
  columns: string[];
  rows: T[];
  rowRenderer: (props: RowRendererProps<T>) => React.ReactNode;
  enableSearch?: boolean;
  search?: string;
  onSearch?: (search: string) => void;
  enablePagination?: boolean;
  pageSize?: number;
  onCreate?: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  labels?: LabelProps;
  className?: string;
}
```

Nos permite definir:

- Los nombres de cada columna.
- Las filas así como definir como pintar cada file.
- Una caja de filtrado por texto libre.
- Paginación.
- Puntos de entrada para comandos CRUD (editar, crear, borrar).
- Un punto de entrada (className) para poder estilar el componente.

- Vamos a verlo en uso, como se nos queda nuestro componente tabla:

- Primero vamos a añadir los comandos de Add / Delete / Update
  en el container:

_./src/pods/employee-list/employee.list.container.tsx_

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
+  const history = useHistory();


  const onLoadEmployeeList = async () => {
    const apiEmployeeList = await getEmployeeList();
    const viewModelEmployeeList = mapEmployeeListFromApiToVm(apiEmployeeList);
    setEmployees(viewModelEmployeeList);
  };

  React.useEffect(() => {
    onLoadEmployeeList();
  }, []);

+  const handleCreate = () => {
+    history.push(routes.editEmployee(null));
+  };
+
+  const handleEdit = (id: string) => {
+    history.push(routes.editEmployee(id));
+  };
+
+  const handleDelete = async (id: string) => {
+   console.log(`Delete: ${id}`)
+  };

  return (
    <>
      <h1>Hello from Employee list POD Container</h1>
      <EmployeeListComponent
        employees={employees}
+        onCreate={handleCreate}
+        onEdit={handleEdit}
+        onDelete={handleDelete}
      />
    </>
  );
};
```

- Vamos ahora a extraer a un componente el pintado de una fila:

_./src/pods/employee-list/components/employee-row.component.tsx_

```tsx
import React from 'react';
import {
  RowRendererProps,
  RowComponent,
  CellComponent,
} from 'common/components';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { Employee } from '../employee-list.vm';

type Props = RowRendererProps<Employee>;

export const EmployeeRowComponent: React.FunctionComponent<Props> = ({
  row,
  onEdit,
  onDelete,
}) => {
  return (
    <RowComponent>
      <CellComponent>
        <Checkbox checked={row.isActive} disabled />
      </CellComponent>
      <CellComponent>{row.id}</CellComponent>
      <CellComponent>{row.name}</CellComponent>
      <CellComponent>{row.email}</CellComponent>
      <CellComponent>
        {row.lastDateIncurred}
        <IconButton onClick={() => onEdit(row.id)}>
          <EditIcon />
        </IconButton>
        <IconButton onClick={() => onDelete(row)}>
          <DeleteIcon />
        </IconButton>
      </CellComponent>
    </RowComponent>
  );
};
```

_./src/pods/employee-list/components/index.ts_

```ts
export * from './employee-row.component';
```

Y vamos refactorizar employee-list

_./src/pods/employee-list/employee-list.component.tsx_

```tsx
import React from 'react';
import {
  TableContainer,
  RowRendererProps,
  useSearchBar,
} from 'common/components';
import { Employee } from './employee-list.vm';
import { EmployeeRowComponent } from './components';

interface Props {
  employeeList: Employee[];
  onCreate: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const EmployeeListComponent: React.FunctionComponent<Props> = ({
  employeeList,
  onCreate,
  onEdit,
  onDelete,
}) => {
  const { filteredList, onSearch, search } = useSearchBar(employeeList, [
    'name',
  ]);

  const contentRender = ({ itemName }) => {
    return (
      <>
        ¿Seguro que quiere borrar a <strong>{itemName}</strong>?
      </>
    );
  };

  return (
    <TableContainer
      columns={['Activo', 'Id', 'Nombre', 'Email', 'Fecha último incurrido']}
      rows={filteredList}
      rowRenderer={(rowProps: RowRendererProps<Employee>) => (
        <EmployeeRowComponent {...rowProps} />
      )}
      onCreate={onCreate}
      onEdit={onEdit}
      onDelete={onDelete}
      labels={{
        searchPlaceholder: 'Buscar empleado',
        createButton: 'Nuevo empleado',
        deleteTitle: 'Eliminar Empleado',
        deleteContent: props => contentRender(props),
        closeButton: 'Cancelar',
        acceptButton: 'Aceptar',
      }}
      enableSearch={true}
      search={search}
      onSearch={onSearch}
      enablePagination={true}
      pageSize={5}
    />
  );
};
```

\*\*\* Ejemplo separado

- Un tema que hemos pasado por alto al trabajar con datos mock, las
  llamadas asíncronas pueden tardar y hay casos en los que no queremos
  que bloqueen el interfaz de usuario y otros que si, tambié tendremos
  casos en los que lanzaremos varias llamadas en paralelo, para controlar
  esto hemos hecho un tracker de promesas, veamos como añadirlo.

- Primero vamos a añadir un delay a nuestra petición de datos:

- Si probamos, nos damos cuenta de que la experiencia de usuario es un poco rara

- Vamos a instalarnos react-promise-tracker y una animación de carga:

- Configuramos React-Promise-tracker

- Creamos un componente de spinner

- Donde queramos mostrar el spinner de carga le indicamos a la llamada
  que trackee la promesa

- Vamos a probar:

- Un tema interesante es que podemos indicar que espera unos milisegundos a
  mostrar el spinner, así con conexiones muy rápidas evitamos que haga un
  parpadeo el spinner.

  - Ahora si bajamos a 400 milisegundos la llamada veremos que el spinner
    no se llega a mostrar.

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End
guiado por un grupo de profesionales ¿Por qué no te apuntas a
nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria
con clases en vivo, como edición continua con mentorización, para
que puedas ir a tu ritmo y aprender mucho.

Y si tienes ganas de meterte una zambullida en el mundo _devops_
apuntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio)
