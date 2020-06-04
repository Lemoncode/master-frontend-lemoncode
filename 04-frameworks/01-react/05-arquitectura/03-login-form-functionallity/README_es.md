# 03 Login form funcionanlidad

Vamos a implementar la funcionalidad en si.

# Pasos

- Copiate el ejemplo anterior _02-login-form y haz un \_npm install_

```bash
npm install
```

- Vamos a añadir la funcionalidad básica para hacer el login (nuestro primero objetivo es completar el caso), creamos un estado para almacenar usuario y clave
  y lo asociamos a los _TextField_

Primero vamos a definir un viewModel para nuestro pod, así lo tenemos todo aislado:

_./src/pods/login/login.vm.ts_

```ts
export interface Login {
  user: string;
  password: string;
}

export const createEmptyLogin = (): Login => ({
  user: '',
  password: '',
});
```

Vamos a crear una _api mock_ para simular una llamada a servidor:

_./src/pods/login.api.ts_

```ts
export const isValidLogin = (
  user: string,
  password: string
): Promise<boolean> =>
  new Promise(resolve => {
    setTimeout(() => {
      // mock call
      resolve(user === 'admin' && password === 'test');
    }, 500);
  });
```

En el container vamos a manejar el intento de login, en el componente
almacenarios los datos temporales que se vaya introdujendo en el formulario.

_./src/pods/login/login.container.tsx_

```diff
import React from 'react';
import { LoginComponent } from './login.component';
+ import {Login, createEmptyLogin} from './login.vm';
+ import { isValidLogin } from './login.api';
+ import { useHistory } from 'react-router-dom';
+ import { routes } from 'core/router';


export const LoginContainer: React.FunctionComponent = () => {
+  const history = useHistory()

+  const loginSucceeded = (isValid: boolean): void => {
+    if (isValid) {
+      history.push(routes.submoduleList);
+    } else {
+      // TODO replace
+      alert('Invalid login');
+    }
+  };

+ const handleLogin = (login : Login) => {
+       isValidLogin(login.user, login.password).then(loginSucceeded);
+ }

  return (
    <>
-      <LoginComponent />
+      <LoginComponent onLogin={handleLogin} />

    </>
  );
};
```

- Vamos al componente presentacional y almacenar la info del formulario, al pulsar el bóton, si la la clave y usuario es _admin_ _test_ lo damos por bueno,
  vamos a simular que tiramos de un servicio mock.

Vamos a definir en las propiedades el _handleLogin_ que vamos a recibir del componente padre.

_./src/pods/login/login.component.tsx_

```diff

+ interface Props {
+   onLogin : () => void;
+ }

- export const LoginComponent: React.FunctionComponent = () => {
+ export const LoginComponent: React.FunctionComponent<Props> = (Props) => {
+   const {onLogin} = props;
```

Primero el estado:

_./src/pods/login/login.component.tsx_

```diff
import React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
+ import { Login, createEmptyLogin } from './login.vm';

interface Props {
  onLogin: (login: Login) => void;
}

export const LoginComponent: React.FunctionComponent<Props> = props => {
  const { onLogin } = props;
+ const [login, setLogin] = React.useState<Login>(createEmptyLogin());
```

Ahora enlazamos los textField

_./src/pods/login/login.component.tsx_

```diff
  <TextField label="Name" margin="normal"
+              value={login.user}
+              onChange={e => setLogin({ ...login, user: e.target.value })}
  />
  <TextField label="Password" type="password" margin="normal"
+              value={login.password}
+              onChange={e => setLogin({ ...login, password: e.target.value })}
  />
```

Finalmente añadimos propiedad para engancharnos al validate login

_./src/pods/login/login.component.tsx_

```diff
      <CardContent>
-        <form>
+        <form onSubmit={e => {e.preventDefault; onLogin(login)}}>
          <div
```

- Si ejecutamos poder ver que esto funciona:

```bash
npm start
```

Esto está genial, pero el alert que se muestra está muy feo, en Material UI
podemos mostrar snack bars o tostadas, tener que repetirlas por cada ventana
puede ser un poco rollo, ¿ Porqué no crear un componente común que sea
muy fácil de usar? Si quieres ver como funciona esto:

https://github.com/Lemoncode/origin-front-admin/tree/master/src/common/components/snackbar

Como ejercicio intenta adaptarlo.

Bueno esto funciona, pero ahora nos toca la parte de martillo fino... nos piden que el login tenga un aspecto más personalizado, desde el departamento de diseño nos proponen el siguiente diseño:

**Pantallazo**

Aquí tenemos dos concerns separados:

- Por un lado el aspecto del formulario (hay que añadir un icono, jugar con margenes...).
- Por otro el uso de colores en general (esto lo trataremos en el siguente
  ejemplo).

- Manos a la obra.

- Si evaluamos

**_ SEGUIR AQUI CANDADO ESTILOS ETC_**

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End
guiado por un grupo de profesionales ¿Por qué no te apuntas a
nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria
con clases en vivo, como edición continua con mentorización, para
que puedas ir a tu ritmo y aprender mucho.

Y si tienes ganas de meterte una zambullida en el mundo _devops_
apuntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio)
