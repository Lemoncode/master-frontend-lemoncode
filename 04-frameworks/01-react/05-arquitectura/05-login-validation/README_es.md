# 05 Login Validation

Vamos a añadir validación en linea al formulario.

# Pasos

- Copiate el ejemplo anterior _04-theming_ y haz un \_npm install\_

```bash
npm install
```

- Vamos a tirar de una librería de gestión de estado de formularios en este
  caso elegiremos **Formik**.

```bash
npm install formik --save
```

- Vamos a instalarnos **Fonk** una librería de validación de formularios
  y su binding para **Formik**

```bash
npm install @lemoncode/fonk @lemoncode/fonk-formik --save
```

- Vamos a montar el armazon de formik en el formulario de login:

_./src/pods/login.component.tsx_

```diff
import React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Login, createEmptyLogin } from './login.vm';
+ import { Formik, Form } from 'formik';
```

_./src/pods/login.component.tsx_

```diff
export const LoginComponent: React.FunctionComponent<Props> = props => {
  const { onLogin } = props;
-  const [login, setLogin] = React.useState<Login>(createEmptyLogin());

  return (
    <Card>
      <CardHeader title="Login" />
      <CardContent>
+        <Formik
+          onSubmit={onLogin}
+          initialValues={createEmptyLogin()}
+        >
+          {() => (
-          <form
-            onSubmit={e => {
-              e.preventDefault();
-              onLogin(login);
-            }}
-          >
+          <Form>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <TextField
                label="Name"
                margin="normal"
                value={login.user}
                onChange={e => setLogin({ ...login, user: e.target.value })}
              />
              <TextField
                label="Password"
                type="password"
                margin="normal"
                value={login.password}
                onChange={e => setLogin({ ...login, password: e.target.value })}
              />
              <Button type="submit" variant="contained" color="primary">
                Login
              </Button>
            </div>
+          </Form>
-          </form>
+         )}
+          </Formik>
      </CardContent>
    </Card>
  );
};
```

- Ahora nos tocaría cambiar los TextFields uno por uno para que se integraran
  con Formik, ¿Por qué no hacernos un wrapper y hacer el trabajo pesado en
  un sólo sitio?

_./src/common/components/form/text-field.component.tsx_

```tsx
import React from 'react';
import { useField } from 'formik';
import MuiTextField, { TextFieldProps } from '@material-ui/core/TextField';

export const TextFieldComponent: React.FunctionComponent<TextFieldProps> = props => {
  const [field, meta] = useField(props.name);
  const textFieldProps = Boolean(field) ? field : props;
  const hasError = Boolean(meta && meta.touched && meta.error);

  return (
    <MuiTextField
      {...props}
      name={textFieldProps.name}
      onChange={textFieldProps.onChange}
      onBlur={textFieldProps.onBlur}
      value={textFieldProps.value}
      error={hasError}
      helperText={hasError ? meta.error : ''}
      fullWidth={true}
      margin="normal"
    />
  );
};
```

Y vamos a crear su barrel:

A nivel de Form:

_./src/common/components/form/index.ts_

```ts
export * from './text-field.component';
```

A nivel de components:

_./src/common/components/index.ts_

```ts
export * from './form';
```

- Vamos a introducir esta carpeta base en nuestra lista de aliases:

_./tsconfig.json_

```diff
    "paths": {
+     "common": ["common"],
      "layout": ["layout"],
      "core": ["core"],
      "scenes": ["scenes"],
      "pods": ["pods"]
    }
```

_./config/webpack/base.js_

```diff
    resolve: {
      alias: {
+       common: helpers.resolveFromRootPath('src/common'),
        layout: helpers.resolveFromRootPath('src/layout'),
        core: helpers.resolveFromRootPath('src/core'),
        scenes: helpers.resolveFromRootPath('src/scenes'),
        pods: helpers.resolveFromRootPath('src/pods'),
      },
```

- Vamos ahora a utilizar los textField en el formulario:

_./src/pods/login.component.tsx_

```diff
import React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
- import TextField from '@material-ui/core/TextField';
+ import { TextFieldComponent } from 'common/components';
import Button from '@material-ui/core/Button';
import { Login, createEmptyLogin } from './login.vm';
import { Formik, Form } from 'formik';
```

_./src/pods/login.component.tsx_

```diff
-    <TextField
+    <TextFieldComponent
+     name="user"
      label="Name"
-      margin="normal"
-      value={login.user}
-      onChange={e => setLogin({ ...login, user: e.target.value })}
    />
-    <TextField
+    <TextFieldComponent
+     name="password"
      label="Password"
      type="password"
-      margin="normal"
-      value={login.password}
-      onChange={e =>
-        setLogin({ ...login, password: e.target.value })
-      }
    />
```

- Comprobamos que esto sigue funcionando:

```bash
npm start
```

- Vamos ahora a por la validacion: definimos el esquema de validación
  del formulario, para ello vamos a hacer uso de Fonk, aquí definimos
  las validaciones por formulario.

_./src/pods/login.validation.ts_

```tsx
import { ValidationSchema, Validators } from '@lemoncode/fonk';
import { createFormikValidation } from '@lemoncode/fonk-formik';

const validationSchema: ValidationSchema = {
  field: {
    user: [Validators.required],
    password: [Validators.required],
  },
};

export const formValidation = createFormikValidation(validationSchema);
```

- Y vamos a aplicarlo en nuestro formulario de login:

_./src/pods/login.component.tsx_

```diff
+ import { formValidation } from './login.validation';
//(...)

    <Formik
      onSubmit={onLogin}
      initialValues={createEmptyLogin()}
+      validate={formValidation.validateForm}
    >
```

- Si ejecutamos podemos ver que se van disparando las validaciones
  conforme vamos editando.

```bash
npm start
```

Fonk tiene una serie de validaciones ya implementada, así como muchas
que te puedes descargar, también te permite implementar las tuyas
propias sea síncronas a asíncronas.

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End
guiado por un grupo de profesionales ¿Por qué no te apuntas a
nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria
con clases en vivo, como edición continua con mentorización, para
que puedas ir a tu ritmo y aprender mucho.

Y si tienes ganas de meterte una zambullida en el mundo _devops_
apuntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio)
