# 05 Login App Headers

In this example we will implement security and redirect to login page if is not authorized using a JWT token in Http Headers.

## Install dependencies

`npm install` to install packages:

```bash
cd back
npm install
```

```bash
cd front
npm install
```

## Start apps

Start `back` app:

```bash
cd ./back
npm start
```

> NOTE: We added `.env` file only for demo purpose. We should ignore this one and add a `.env.example` as example.

Start `front` app:

```bash
cd ./front
npm start
```

## Login flow

Let's add backend security, firts we will `create token` and return it on body response:

_./back/src/pods/security/security.api.ts_

```diff
...

const createUserSession = (user: User): UserSession => {
  return {
    firstname: user.firstname,
    lastname: user.lastname,
-   token: '',
+   token: createToken(user),
  };
};

```

> NOTE:
>
> [401 Unauthorized](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401)
>
> [403 Forbidden](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403)

Let's check this token on each requests:

_./back/src/index.ts_

```diff
...
- import { securityApi } from '#pods/security/index.js';
+ import { securityApi, jwtMiddleware } from '#pods/security/index.js';
import { clientApi } from '#pods/client/index.js';
import { orderApi } from '#pods/order/index.js';

const app = createRestApiServer();
app.use(express.json());

app.use(API_ROUTES.SECURITY, securityApi);
- app.use(API_ROUTES.CLIENTS, clientApi);
+ app.use(API_ROUTES.CLIENTS, jwtMiddleware, clientApi);
- app.use(API_ROUTES.ORDERS, orderApi);
+ app.use(API_ROUTES.ORDERS, jwtMiddleware, orderApi);

app.listen(ENV.PORT, () => {
  console.log(`Server running http://localhost:${ENV.PORT}`);
});

```

Now, we should set the `token` value in HTTP headers on each request:

_./front/src/pods/login/api/login.api.ts_

```diff
import axios from 'axios';
+ import { setHeader, headerConstants } from '#core/api';
import { UserSession } from './login.api-model';

const url = '/api/security/login';

export const isValidLogin = async (
  user: string,
  password: string
): Promise<UserSession> => {
  const { data } = await axios.post<UserSession>(url, { user, password });
+ setHeader(headerConstants.authorization, data.token);
  return data;
};
```

## Logout flow

Update backend endpoint:

_./back/src/pods/security/security.api.ts_

```diff
...
+ import { jwtMiddleware } from './security.middlewares.js';
import { JWT_SIGN_ALGORITHM } from './security.constants.js';
...

- .post('/logout', async (req, res) => {
+ .post('/logout', jwtMiddleware, async (req, res) => {
    // NOTE: We cannot invalidate token using jwt libraries.
    // Different approaches:
    // - Short expiration times in token
    // - Black list tokens on DB
    res.sendStatus(200);
  });

```

And updaste the frontend code to clean the header on client side:

_./front/src/core/app-bar/api/app-bar.api.ts_

```diff
import axios from 'axios';
+ import { setHeader, headerConstants } from '#core/api';

const url = '/api/security/logout';

export const logout = async (): Promise<boolean> => {
  await axios.post(url);
+ setHeader(headerConstants.authorization, '');

  return true;
};

```

## Redirect to login page

Create `PrivateRoute`:

_./front/src/core/router/router.component.tsx_

```diff
import React from 'react';
import {
  HashRouter,
  Routes,
  Route,
  Navigate,
+ Outlet,
} from 'react-router';
+ import { AuthContext } from '#core/auth';
import { LoginScene, ListScene } from '#scenes';
- import { switchRoutes } from './routes';
+ import { switchRoutes, linkRoutes } from './routes';

export const RouterComponent: React.FC = () => {
  return (
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  );
};

+ const PrivateRoutes = () => {
+   const { userSession } = React.useContext(AuthContext);
+   return userSession?.userName ? (
+     <Outlet />
+   ) : (
+     <Navigate to={linkRoutes.login} />
+   );
+ };

const AppRoutes: React.FC = () => {
  useApiConfig();
  return (
    <Routes>
      <Route path={switchRoutes.login} element={<LoginScene />} />
+     <Route element={<PrivateRoutes />}>
        <Route path={switchRoutes.list} element={<ListScene />} />
+     </Route>
      <Route
        path={switchRoutes.root}
        element={<Navigate to={switchRoutes.login} />}
      />
    </Routes>
  );
};

```

> Try to navigate to /list without login.

Now, let's take the next scenario:

1. User logs in.
2. Make some requests and use the app.
3. User goes to sleep and the token expires, but the app is still open.
4. User wakes up and tries to make a request.
5. We will recieve a `401` response. But the app doesn't redirect to login page.

> Add comments to the `PrivateRoutes` code to explain the scenario.

_./front/src/core/router/router.component.tsx_

```jsx
//    <Route element={<PrivateRoutes />}>
<Route path={switchRoutes.list} element={<ListScene />} />
//    </Route>
```

Let's do it:

_./front/src/core/api/api.hooks.ts_

```javascript
import React from "react";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router";
import { useSnackbarContext } from "#common/components";
import { linkRoutes } from "#core/router";

export const useApiConfig = () => {
  const navigate = useNavigate();
  const { showMessage } = useSnackbarContext();

  React.useEffect(() => {
    axios.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response.status === 401) {
          showMessage("You should login", "error");
          navigate(linkRoutes.login);
        }
      }
    );
  }, []);
};
```

Update barrel file:

_./front/src/core/api/index.ts_

```diff
export * from './api.helpers';
export * from './api.constants';
+ export * from './api.hooks';

```

Use it on `router.component`:

_./front/src/core/router/router.component.tsx_

```diff
import React from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router';
import { AuthContext } from '#core/auth';
+ import { useApiConfig } from '#core/api';
import { LoginScene, ListScene } from '#scenes';
import { switchRoutes, linkRoutes } from './routes';

...

const AppRoutes: React.FC = () => {
+ useApiConfig();
  return (
    <Routes>
      <Route path={switchRoutes.login} element={<LoginScene />} />
      <Route path={switchRoutes.list} element={<ListScene />} />
      <Route
        path={switchRoutes.root}
        element={<Navigate to={switchRoutes.login} />}
      />
    </Routes>
  );
};

```

> Try to fetch clients or orders without login.

# Using CORS

In this example we will use CORS to allow the frontend app to access the backend API instead of using a proxy.

Let's remove the proxy configuration from the frontend app:

_./front/vite.config.ts_

```diff
...
  plugins: [react()],
-  server: {
-    proxy: {
-      '/api': 'http://localhost:3000',
-    },
-  },
});

```

If we try to fetch data from some API endpoint, we will get a CORS error. Update login request:

_./front/src/pods/login/api/login.api.ts_

```diff
...

- const url = '/api/security/login';
+ const url = 'http://localhost:3000/api/security/login';

...

```

> NOTE: The browser will block the request because of CORS policy but the server will receive the request and respond with a 200 status code. We can check it if we add a console log in the backend API.

Let's update example to check if it's working with cors:

```bash
npm install cors --save
npm install @types/cors --save-dev
```

Configure cors:

_./back/src/core/servers/rest-api.server.ts_

```diff
import express from 'express';
+ import cors from 'cors';

export const createRestApiServer = () => {
  const app = express();
  app.use(express.json());
+ app.use(
+   cors({
+     credentials: true,
+     origin: '*',
+   })
+ );

  return app;
};

```

> In a real scenario we should set `origin` to the real domain, for example: `http://my-domain.com`.

Update logout request:

_./front/src/core/app-bar/api/app-bar.api.ts_

```diff
...

- const url = '/api/security/logout';
+ const url = 'http://localhost:3000/api/security/logout';

...

```

Update list requests:

_./front/src/pods/list/api/list.api.ts_

```diff
...

- const clientUrl = '/api/clients';
+ const clientUrl = 'http://localhost:3000/api/clients';
- const orderUrl = '/api/orders';
+ const orderUrl = 'http://localhost:3000/api/orders';

...

```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
