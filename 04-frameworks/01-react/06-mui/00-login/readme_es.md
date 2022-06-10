# Mui - Login

## resumen

Hemos aprendido a crear una aplicación React Robusta, ahora vamos a aprender a darle buen aspecto y mejorar
su usabilidad, para ello utilizaremos mui una librería que implementa el estándar Material Design de Google.

En este ejemplo vamos a instalar las librerías necesarias y darle un aspecto más profesional a nuestra ventana
de login.

## Pasos

Instalamos la librería mui y @emotion para estilar (libería CSS in JS, en una sesión posterior de este
máster entraremos en detalle con esta librería).

```bash
npm install @mui/material @emotion/react @emotion/styled
```

Mui por defecto usa la fuente _roboto_ vamos a traerla de una CDN:

_./src/index.html_

```diff
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>My App Example</title>
+   <link
+   rel="stylesheet"
+   href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
+  />
  </head>
```

Vamos a meter nuestra caja de login en una _card_ de material ui, para ello podemos buscar
este componente en la documentación de mui (sección components) y veremos que nos encontramos
hasta con CodeSandboxes en vivo (https://mui.com/components/cards/).

Modificamos nuestro login component.

_./src/pods/login/login.component.tsx_

```diff
import css from "./login.styles.css";
+ import Card from '@mui/material/Card';
+ import CardHeader from '@mui/material/CardHeader';
+ import CardContent from '@mui/material/CardContent';
```

```diff
  return (
+    <Card sx={{ padding: "20px" }}>
    <Formik
      onSubmit={onLogin}
      initialValues={createEmptyLogin()}
      validate={formValidation.validateForm}
    >
      {() => (
        <Form>
          <div className={css.container}>
            <InputFormik name="username" placeholder="Username" />
            <InputFormik
              name="password"
              placeholder="Password"
              type="password"
            />
            <button type="submit">login</button>
          </div>
        </Form>
      )}
    </Formik>
+    </Card>

  );
```

> _sx_ nos permite añadir estilado al component card, también podemos usar
> la aproximación styled component (esto daría para una sesión específica de CSS in JS).

Vamos a por la cabecera y el cuerpo:

```diff
    <Card sx={{ padding: "20px" }}>
+     <CardHeader title="Login" />
+     <CardContent>
        <Formik
          onSubmit={onLogin}
          initialValues={createEmptyLogin()}
          validate={formValidation.validateForm}
        >
          {() => (
            <Form>
              <div className={css.container}>
                <InputFormik name="username" placeholder="Username" />
                <InputFormik
                  name="password"
                  placeholder="Password"
                  type="password"
                />
                <button type="submit">login</button>
              </div>
            </Form>
          )}
        </Formik>
+      </CardContent>
    </Card>
```

Vamos a cambiar el botón de login por el de mui:

```diff
+ import Button from '@mui/material/Button';
```

```diff
  <InputFormik
    name="password"
    placeholder="Password"
    type="password"
  />
-  <button type="submit">login</button>
+    <Button variant="contained" type="submit">
+      login
+    </Button>
```

Esto va teniendo mejor aspecto y la página sigue funcionando, ahora toca reemplazar el _input_
por el _TextField_ de material UI (textField es muy potente podemos verlo en acción:
https://mui.com/components/text-fields/).

Vamos a usar la opción que reporta los errores integrado en MUI.

Como estamos integrados con Formik, tenemos que crear en common/components/forms un wrapper
que integre el text field, creamos el wrapper:

_./src/common/components/forms/textfield-formik.component.tsx_

```tsx
import React from "react";
import { useField } from "formik";
import TextField, { TextFieldProps } from "@mui/material/TextField";

// Input props, we got this value by double clicking on a input element
// and going to definition (d.ts)
export const TextFieldFormik: React.FC<TextFieldProps> = (props) => {
  // useField allows us to extract all formik metadata about that field
  const [field, meta] = useField(props.name);
  // If the field doesn't exist then treat this as a normal input
  const textFieldProps = Boolean(field) ? field : props;
  // We only want to display the field validation error messsage
  // if formik is enabled, and is the field has been touched
  // not a very good UX experience to show a blank form full
  // of error a the initial state
  const hasError = Boolean(meta && meta.touched && meta.error);

  return (
    <TextField
      variant="standard"
      {...props}
      name={textFieldProps.name}
      onChange={textFieldProps.onChange}
      onBlur={textFieldProps.onBlur}
      value={textFieldProps.value}
      error={hasError}
      helperText={hasError ? meta.error : ""}
      fullWidth={true}
      margin="normal"
    />
  );
};
```

_./src/common/componets/forms/index.ts_

```diff
export * from "./input-formik.component";
+ export * from "./textfield-formik.component"
```

Y vamos a reemplazar los inputs por el nuevo text field:

_./src/pods/login/login.components.tsx_

```diff
import React from "react";
import { Login, createEmptyLogin } from "./login.vm";
import { Formik, Form } from "formik";
- import { InputFormik } from "@/common/components";
+ import { TextFieldFormik } from "@/common/components";

import { formValidation } from "./login.validation";

```

```diff
  <Form>
    <div className={css.container}>
-      <InputFormik name="username" placeholder="Username" />
+      <TextFieldFormik name="username" placeholder="Username" />
-      <InputFormik
-        name="password"
-        placeholder="Password"
-        type="password"
-      />
+     <TextFieldFormik
+                  name="password"
+                  placeholder="Password"
+                  type="password"
+                />
      <Button variant="contained" type="submit">
        login
      </Button>
    </div>
  </Form>
```

Si probamos, podemos ver el ejemplo funcionando y con
nuestro nuevo estilo.

```bash
npm start
```
