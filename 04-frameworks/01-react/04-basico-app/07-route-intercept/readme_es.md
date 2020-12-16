# 07 Refacctor

## Resumen

Este ejemplo toma como punto de partida el ejemplo _06-refactor_.

Vamos tener ventanas accesible para usuarios anónimos (login) y ventanas
que si van a necesitar que el usuario

## Paso a Paso

- Primero copiamos el ejemplo anterior, y hacemos un _npm install_

```bash
npm install
```

- Vamos a a almacenar, el usuario logado en un sitio global (contexto).

_./core/auth/authcontext.ts_

```tsx
import React from "react";

interface Context {
  userInfo: string;
  setUserInfo: (user: string) => void;
}

export const AuthContext = React.createContext<Context>({
  userInfo: "",
  setUserInfo: (user: string) =>
    console.log("Did you forgot to add AuthContext on top of your app?"),
});

export const AuthProvider: React.FunctionComponent = (props) => {
  const { children } = props;
  const [userInfo, setUserInfo] = React.useState<string>("");

  return (
    <AuthContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </AuthContext.Provider>
  );
};
```

- Creamos un barrel:

_./core/auth/index.ts_

```tsx
export * from "././authcontext";
```

- Lo añadimos al provider:

_./app.tsx_

```diff
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { LoginPage, ListPage, DetailPage } from "./pages";
+ import {AuthProvider} from './core';

export const App = () => {
  return (
+ <AuthProvider>
    <Router>
      <Switch>
        <Route exact path="/">
          <LoginPage />
        </Route>
        <Route path="/list">
          <ListPage />
        </Route>
        <Route path="/detail/:id">
          <DetailPage />
        </Route>
      </Switch>
    </Router>
+ </AuthProvider>

  );
};
```

- En el login lo seteamos en el contexto.

_./src/pages/login.tsx_

```diff
+ import {AuthContext} from '../core';

// (...)
export const LoginPage: React.FC = () => {
  const history = useHistory();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
+ const {setUserInfo} = React.useContext(AutContext);


  const handleNavigation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (username === "admin" && password === "test") {
+     setUserInfo(username);
      history.push("/list");
    } else {
      alert("User / password not valid, psst... admin / test");
    }
  };
```

- Ahora que ya tenemos esta información, podemos añadir un interceptor en nuestro router, y comprobar
  si el usuario esta logado, en caso negativo lo redirigimos a la página de login.

_./core/auth/authroute.tsx_

```tsx
import React from "react";
import { Route, RouteProps, useHistory } from "react-router-dom";
import { AuthContext } from "../core";

export const AuthRouteComponent: React.FunctionComponent<RouteProps> = (
  props
) => {
  const { userInfo } = React.useContext(AuthContext);
  const history = useHistory();

  React.useEffect(() => {
    if (!userInfo) {
      history.push("/");
    }
  }, [props.location.pathname]);

  return <Route {...props} />;
};
```

- Vamos a añadirlo al barrel.

_./core/index.ts_

```diff
export * from "./authcontext";
+ export * from "./authroute";
```


- En el lado del router vamos a reemplazar los _routes_ por nuestro wrapper.

_./app.tsx_

```diff
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { LoginPage, ListPage, DetailPage } from "./pages";
import { AuthProvider } from "./core";

export const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <Route exact path="/">
            <LoginPage />
          </Route>
          <Route path="/list">
            <ListPage />
          </Route>
          <Route path="/detail/:id">
            <DetailPage />
          </Route>
        </Switch>
      </Router>
    </AuthProvider>
  );
};
```

- Ahora podemos probar, si nos logamos podremos navegar a otra página, si directamente abrimos otro enlace
  sin estar logados.

- ¿Cuales sería los siguiente pasos?

- ¿ Qué pasa si nuestra sesión caduca? Lo ideal aquí sería crear un wrapper en nuestras llamadas a los servicios
  (o usar un interceptor de por ejemplo axios) y comprobar si recibimos un código de no autorizado redirigir a la
  página de login.

- ¿ Qué pasa si uso cookies y refresco la página? Aquí sería buena idea tener un endpoint en servidor
  para comprobar si el usuario está logado en ese caso nuestro interceptor de ruta preguntaría al endpoint si
  esta logado y en caso de que no nos redigiría a la página de login.

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End
guiado por un grupo de profesionales ¿Por qué no te apuntas a
nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria
con clases en vivo, como edición continua con mentorización, para
que puedas ir a tu ritmo y aprender mucho.

Y si tienes ganas de meterte una zambullida en el mundo _devops_
apuntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio)
