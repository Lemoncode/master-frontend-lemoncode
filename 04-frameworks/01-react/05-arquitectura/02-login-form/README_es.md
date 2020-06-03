# 02 Login form

Vamos a implementar un formulario de login y conectarlo con un servicio
mock de validación de usuario y clave.

# Pasos

- Copiate el ejemplo anterior _01-routes y haz un \_npm install_

```bash
npm install
```

- Tenemos una escena de login, pero comentamos que las escenas deberían
  tener lo mínimo:

  - Elección de layout.
  - Pods que usa.

- Así que vamos a crearnos un POD de login.

Vamos a por el componente presentacional, sólo nos preocuparemos
de pintar y recibir de las props la info y los callback que
hagan falta:

_./src/pods/login/login.component.tsx_

```tsx
import React from 'react';

export const LoginComponent: React.FunctionComponent = () => {
  return <h2>Hello from Login Component</h2>;
};
```

Vamos a por el contenedor, esto consumirá el componente presentacional y
expondra los enganches con los servicios de lógica de negocio, acceso
a servicios.

_./src/pods/login/login.container.tsx_

```tsx
import React from 'react';
import { LoginComponent } from './login.component';

export const LoginContainer: React.FunctionComponent = () => {
  return (
    <>
      <h1>Hello from Login Container</h1>
      <LoginComponent />
    </>
  );
};
```

- Vamos a crear un barrel en el pod de login

_./src/pods/login/index.ts_

```ts
export * from './login.container';
```

- Antes de conectarlo con la escena vamos a evitar los path relativos
  en los imports los "../", vamos a añadirlo a nuestro tsconfig y
  webpack.config

_./tsconfig.json_

```diff
    "paths": {
      "core": ["core"],
      "scenes": ["scenes"],
+      "pods": ["pods"]
    }
```

_./config/wepback/base.config.json_

```diff
    resolve: {
      alias: {
        core: helpers.resolveFromRootPath('src/core'),
        scenes: helpers.resolveFromRootPath('src/scenes'),
+       pods: helpers.resolveFromRootPath('src/pods'),
      },
```

- Y conectarlo con la escena:

_./src/scenes/login.scene.tsx_

```diff
import React from 'react';
- import { Link } from 'react-router-dom';
- import { routes } from 'core/router';
+ import { LoginContainer } from 'pods/login';

export const LoginScene: React.FC = () => {
-  return (
-    <>
-      <h1>Hello from Login Scene!</h1>
-      <Link to={routes.submoduleList}>Navigate to submodule list</Link>
-    </>
+  return <LoginContainer />;
  );
};
```

- Comprobamos que está funcionando:

```bash
npm start
```

- Es hora de maquetar un diálogo de login, vamos a usar _material-ui_
  para tener una aspecto profesional, lo instalamos así como su colección iconos:

```bash
npm install @material-ui/core @material-ui/icons --save
```

- Para estilar usaremos Emotion (CSS in JS), vamos a instalarlo:

```bash
npm install emotion --save
```

- Montemos el diálgo básico de login:

- No esta mal el aspecto, pero se ve raro pegado a la izquierda, ¿ No podríamos
  centrarlo? Correcto vamos a generar un layout que centre el diálogo:

Acabamos de ver como se definen los layouts, estos son genérios para cualquier ventana, también podríamos definir ese layout a nivel de router (ventaja no
redibujamos al cambiar de página).

- Vamos a añadir la funcionalidad básica para hacer el login (nuestro primero objetivo es completar el caso), creamos un estado para almacenar usuario y clave
  y lo asociamos a los _TextField_

- Al pulsar el bóton, si la la clave y usuario es _admin_ _test_ lo damos por bueno,
  vamos a simular que tiramos de un servicio mock.

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
