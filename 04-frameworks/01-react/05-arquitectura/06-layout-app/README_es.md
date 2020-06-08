# 06 App Layout

Vamos a crear la máster page para el resto de páginas.

# Pasos

- Copiate el ejemplo anterior _05-login-validation_ y haz un \_npm install\_

```bash
npm install
```

En la página de login creamos un layout que centraba el contenido
de la escena de login, ahora vamos a implementar un layout
en el que se muestra una cabecera y, además mostraremos
el nombre del usuario que esta logado.

- Vamos primero a crear el layout:

_./src/layouts/app.layout.tsx_

```tsx
import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

export const AppLayout: React.FC = ({ children }) => (
  <div>
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" color="inherit">
          Origin - Project tracker
        </Typography>
      </Toolbar>
    </AppBar>
    {children}
  </div>
);
```

- Vamos a añadirlo al barrel de layouts:

_./src/layouts/index.ts_

```diff
export * from './centered.layout';
+ export * from './app.layout';
```

- Vamos a usarlo las página de aplicación que hemos creado:

_./src/scenes/submodule-list.scene.tsx_

```diff
import React from 'react';
import { Link } from 'react-router-dom';
import { routes } from 'core/router';
+ import { AppLayout } from 'layouts';

export const SubmoduleListScene: React.FC = () => {
  return (
-    <>
+    <AppLayout>
      <h1>Submodule list Scene!</h1>
      <Link to={routes.employees}>Navigate employee list</Link>
-    </>
+    </AppLayout>
  );
};
```

_./src/scenes/employee-list.scene.tsx_

```diff
import React from 'react';
import { Link } from 'react-router-dom';
import { routes } from 'core/router';
+ import { AppLayout } from 'layouts';

export const EmployeeListScene: React.FC = () => {
  return (
-    <>
+    <AppLayout>
      <h1>Employee list Scene!</h1>
      <Link to={routes.editEmployee('232')}>Navigate to edit employee 232</Link>
-    </>
+    </AppLayout>
  );
};
```

_./src/scenes/employee.scene.tsx_

```diff
import React from 'react';
import { Link } from 'react-router-dom';
import { routes } from 'core/router';
+ import { AppLayout } from 'layouts';

export const EmployeeScene: React.FC = () => {
  return (
-    <>
+    <AppLayout>
      <h1>Employee Scene!</h1>
      <Link to={routes.employees}>Back to employee list</Link>
-    </>
+    </AppLayout>
  );
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
