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

- Alternative en core router

_./src/core/router/router.component.tsx_

```diff
+        <AppLayout>
          <Route
            exact={true}
            path={switchRoutes.submoduleList}
            component={SubmoduleListScene}
          />
          <Route
            exact={true}
            path={switchRoutes.employees}
            component={EmployeeListScene}
          />
          <Route
            exact={true}
            path={switchRoutes.editEmployee}
            component={EmployeeScene}
          />
+        </AppLayout>
```

- Vamos ahora a almacenar el nombre del usuario que se ha logado,
  para ello haremos uso del context de React:

Primero creamos un viewmodel (a futuro seguro que almacenaremos más info,
por ejemplo roles del usuario etc...)

_./src/common-app/auth/auth.vm.tsx_

```ts
export interface UserSession {
  userName: string;
}

export const createEmptyUserSession = (): UserSession => ({
  userName: '',
});
```

_./src/common-app/auth/auth.context.tsx_

```tsx
import React from 'react';
import { UserSession, createEmptyUserSession } from './auth.vm';

interface Context extends UserSession {
  setUserSession: (userSession: UserSession) => void;
}

const noUserLogin = 'no user login';

export const AuthContext = React.createContext<Context>({
  userName: noUserLogin,
  setUserSession: () =>
    console.warn(
      'If you area reading this, likely you forgot to add the provider on top of your app'
    ),
});

export const AuthProvider: React.FC = ({ children }) => {
  const [userSession, setUserSession] = React.useState<UserSession>(
    createEmptyUserSession()
  );

  return (
    <AuthContext.Provider
      value={{
        userName: userSession.userName,
        setUserSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
```

Y su barrel:

_./src/common-app/auth/index.tsx_

```ts
export * from './auth.context';
```

- Tenemos que crear un nuevo alias:

_./tsconfig.json_

```diff
    "paths": {
+     "common-app": ["common-app"],
      "common": ["common"],
      "layouts": ["layouts"],
      "core": ["core"],
      "scenes": ["scenes"],
      "pods": ["pods"]
    }
```

_./config/webpack/base.ts_

```diff
  alias: {
+   "common-app": helpers.resolveFromRootPath('src/common-app'),
    common: helpers.resolveFromRootPath('src/common'),
    layouts: helpers.resolveFromRootPath('src/layouts'),
    core: helpers.resolveFromRootPath('src/core'),
    scenes: helpers.resolveFromRootPath('src/scenes'),
    pods: helpers.resolveFromRootPath('src/pods'),
  },
```

- Vamos a inicializar este contexto a nivel de aplicación:

_./src/app.tsx_

```diff
import React from 'react';
import { hot } from 'react-hot-loader/root';
import { RouterComponent } from 'core/router';
import { ThemeProviderComponent } from 'core/theme';
+ import { AuthProvider } from 'common-app/auth';

const App: React.FunctionComponent = () => {
  return (
    <ThemeProviderComponent>
+     <AuthProvider>
        <RouterComponent />
+     </AuthProvider>
    </ThemeProviderComponent>
  );
};

export default hot(App);
```

- Y justo cuando el usuario hace login vamos a establecer el valor en el contexto:

_./src/pods/login/login.container.tsx_

```diff
import React from 'react';
import { LoginComponent } from './login.component';
import { Login } from './login.vm';
import { isValidLogin } from './login.api';
import { useHistory } from 'react-router-dom';
import { routes } from 'core/router';
+ import { AuthContext } from 'common-app/auth';


export const LoginContainer: React.FunctionComponent = () => {
+  const { setUserSession } = React.useContext(AuthContext);
  const history = useHistory();

    const handleLogin = (login: Login) => {
    setUserSession({ userName: login.user });
-    isValidLogin(login.user, login.password).then(loginSucceeded);
+    isValidLogin(login.user, login.password).then((result) => {
+      setUserSession({ userName: login.user });
+      loginSucceeded(result);
+});

  };
```

- Ahora nos vamos al layour de aplicacíon y mostramos el nombre del usuario logado:

_./src/layout/app.layout.tsx_

```diff
import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
+ import { AuthContext } from 'common-app/auth';

- export const AppLayout: React.FC = ({ children }) => (
+ export const AppLayout: React.FC = ({ children }) => {
+  const { userName } = React.useContext(AuthContext);
+  return (
  <div>
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" color="inherit">
          Origin - Project tracker
        </Typography>
+        <Typography
+          variant="h6"
+          color="inherit"
+        >
+          {userName}
+        </Typography>
      </Toolbar>
    </AppBar>
    {children}
  </div>
);
```

- Desplazemos el nombre a la derecha:

_./src/layout/app.layout.styles.ts_

```ts
import { css } from 'emotion';
import { theme } from 'core/theme';

export const loginText = css`
  margin-left: auto;
  padding-right: ${theme.spacing(0.1)}rem;
`;
```

_./src/layout/app.layout.tsx_

```diff
+ import * as classes from './app.layout.styles';
// (...)

  <Typography
    variant="h6"
    color="inherit"
+   className={classes.loginText}
  >
    {userName}
  </Typography>
```

- Vamos a probarlo...

```bash
npm start
```

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End
guiado por un grupo de profesionales ¿Por qué no te apuntas a
nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria
con clases en vivo, como edición continua con mentorización, para
que puedas ir a tu ritmo y aprender mucho.

Y si tienes ganas de meterte una zambullida en el mundo _devops_
apuntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio)
