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

- Vamos a crearnos el tab de datos del empleado:

Aquí vamos a ver los fichero que están envueltos en la creación, para desarrollarlos
desde cero el flujo sería:

- Creo el componente.
- Maqueto el componente.
- Defino las validaciones.
- Las ensamblo en el componente.

- A este componente le va a hacer falta un checkbox wrapeado
  con validación vamos a crear el componente común

_./src/common/components/form/checkbox.styles.ts_

```ts
import { css } from 'emotion';
import { theme } from 'core/theme';

export const root = css`
  justify-content: flex-end;
`;
```

_./src/common/components/form/checkbox.component.tsx_

```tsx
import React from 'react';
import { useField } from 'formik';
import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import * as classes from './checkbox.styles';

interface Props extends CheckboxProps {
  label?: string;
  labelPlacement?: 'end' | 'start' | 'top' | 'bottom';
  error?: boolean;
  helperText?: string;
}

export const CheckboxComponent: React.FunctionComponent<Props> = props => {
  const {
    label,
    labelPlacement,
    error,
    name,
    checked,
    onChange,
    onBlur,
    ...checkboxProps
  } = props;
  const [field, meta] = Boolean(name) ? useField(name) : [];
  const hasError = error || Boolean(meta && meta.touched && meta.error);
  const helperText = Boolean(field) ? meta?.error : props.helperText;

  return (
    <FormControl
      className={classes.root}
      error={hasError}
      fullWidth={true}
      margin="normal"
    >
      <FormControlLabel
        control={
          <Checkbox
            {...checkboxProps}
            name={name}
            checked={checked || field?.value}
            onChange={onChange || field?.onChange}
            onBlur={onBlur || field?.onBlur}
          />
        }
        label={label}
        labelPlacement={labelPlacement}
      />

      {hasError && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};
```

_./src/common/components/form/index.ts_

```ts
export * from './checkbox';
```

_./src/common/components/form/index.ts_

```diff
export * from './text-field.component';
+ export * from './checkbox';
```

Ahora si vampos a por el tab de data

_./src/pods/employee/components/data.component.tsx_

```tsx
import React from 'react';
import { Formik, Form } from 'formik';
import { TextFieldComponent, CheckboxComponent } from 'common/components';
import { cx } from 'emotion';
import { Employee } from '../employee.vm';

interface Props {
  employee: Employee;
  onSave: (employee: Employee) => void;
  onCancel: () => void;
}

export const DataComponent: React.FunctionComponent<Props> = ({
  employee,
  onSave,
  onCancel,
}) => {
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

_./src/pods/employee/components/employee.mapper.ts_

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
+ import { mapEmployeeFromApiToVm } from './employee.mappers';


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

- Vamos a definir un componente footer que usaremos en otros componentes
  de edición:

_./src/common-app/command-footer/command-footer.style.ts_

```tsx
import { css } from 'emotion';

export const footerButtonsContainer = css`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 1rem;
`;
```

_./src/common-app/command-footer/command-footer.component.tsx_

```tsx
import * as React from 'react';
import { cx } from 'emotion';
import Button from '@material-ui/core/Button';
import * as classes from './command-footer.style';

interface LabelProps {
  cancelButton?: string;
  saveButton?: string;
}

interface Props {
  onCancel: () => void;
  onSave?: () => void;
  labels?: LabelProps;
  className?: string;
}

export const CommandFooterComponent: React.FunctionComponent<Props> = props => {
  const { onCancel, onSave, className } = props;
  const labels: LabelProps = {
    cancelButton: 'Cancelar',
    saveButton: 'Guardar',
    ...props.labels,
  };

  return (
    <div className={cx(classes.footerButtonsContainer, className)}>
      <Button variant="contained" color="primary" onClick={onCancel}>
        {labels.cancelButton}
      </Button>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        onClick={() => {
          if (onSave) onSave();
        }}
      >
        {labels.saveButton}
      </Button>
    </div>
  );
};
```

_./src/common-app/command-footer/index.ts_

```tsx
export * from './command-footer.component';
```

- Y Vamos a darle uso en este tab:

_./src/pods/employee/components/data.component.tsx_

```diff
import { Employee } from '../employee.vm';
+ import { CommandFooterComponent } from '../../../common-app/command-footer';
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
+ import { formValidation } from './data.validations';

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
