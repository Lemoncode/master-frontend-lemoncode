# 05 Login App Headers

In this example we will implement security and redirect to login page if is not authorized using a JWT token in Http Headers.

# Steps to build it

- Copy previous example.

- `npm install` to install packages:

```bash
npm install
```

- Start `back` app:

```bash
cd ./back
npm start
```

> NOTE: We added `.env` file only for demo purpose. We should ignore this one and add a `.env.example` as example.

- Start `front` app:

```bash
cd ./front
npm start
```

> NOTE:
> [401 Unauthorized](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401)
> [403 Forbidden](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403)

- Let's add backend security, firts we will `create token` and return it on body response:

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

- Let's check this token on each requests:

_./back/src/app.ts_

```diff
...
- import { securityApi } from 'pods/security';
+ import { securityApi, jwtMiddleware } from 'pods/security';
import { clientApi } from 'pods/client';
import { orderApi } from 'pods/order';

const app = createApp();

app.use(apiRouteConstants.security, securityApi);
- app.use(apiRouteConstants.client, clientApi);
+ app.use(apiRouteConstants.client, jwtMiddleware, clientApi);
- app.use(apiRouteConstants.order, orderApi);
+ app.use(apiRouteConstants.order, jwtMiddleware, orderApi);

app.listen(envConstants.PORT, () => {
  console.log(`Server ready at http://localhost:${envConstants.PORT}`);
});

```

- Now, we should set the `token` value in HTTP headers on each request:

_./front/src/pods/login/api/login.api.ts_

```diff
import Axios from 'axios';
+ import { setHeader, headerConstants } from 'core/api';
import { UserSession } from './login.api-model';

const url = '/api/security/login';

export const isValidLogin = async (
  user: string,
  password: string
): Promise<UserSession> => {
  const { data } = await Axios.post<UserSession>(url, { user, password });
+ setHeader(headerConstants.authorization, data.token);
  return data;
};

```

_./back/src/pods/security/security.api.ts_

```diff
...
+ import { jwtMiddleware } from './security.middlewares';
import { jwtSignAlgorithm } from './security.constants';
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
> NOTE: It will fail if we use `jwtMiddleware` on securityApi
> `app.use(apiRouteConstants.security, jwtMiddleware, securityApi);`

- And clean it on logout:

_./front/src/common-app/app-bar/api/app-bar.api.ts_

```diff
import Axios from 'axios';
+ import { setHeader, headerConstants } from 'core/api';

const url = '/api/security/logout';

export const logout = async (): Promise<boolean> => {
  await Axios.post(url);
+ setHeader(headerConstants.authorization, '');
  return true;
};

```

- Now, we will implement a redirect to login page on `401` Not Authorize responses:

_./front/src/common-app/auth/auth.hooks.ts_

```javascript
import { useNavigate } from 'react-router-dom';
import { useSnackbarContext } from 'common/components';
import { linkRoutes } from 'core/router';
import { AxiosError } from 'axios';

type Request = (...params: any[]) => Promise<any>;

export const useAuthRequest = <T extends Request[]>(...requestList: T): T => {
  const navigate = useNavigate();
  const { showMessage } = useSnackbarContext();

  const authRequestList = requestList.map((request) => async (...params) => {
    try {
      return await request(...params);
    } catch (errorResponse) {
      if (isAuthError(errorResponse)) {
        navigate(linkRoutes.login);
        showMessage('You should login', 'error');
        throw undefined;
      }
      throw errorResponse;
    }
  }) as T;

  return authRequestList;
};

const isAuthError = (error: AxiosError): boolean => {
  const errorCode = error.response.status;

  return errorCode === 401;
};

```

- Update barrel file:

_./front/src/common-app/auth/index.ts_

```diff
export * from './auth.context';
export * from './auth.vm';
+ export * from './auth.hooks';

```

- Use it on `list container`:

_./front/src/pods/list/list.container.tsx_

```diff
import React from 'react';
+ import { useAuthRequest } from 'common-app/auth';
import * as api from './api';
...

export const ListContainer: React.FunctionComponent<Props> = (props) => {
  const { className } = props;
+ const [getClientList, getOrderList] = useAuthRequest(
+   api.getClientList,
+   api.getOrderList
+ );

...
  const handleLoadClientList = async () => {
    try {
-     const apiClientList = await api.getClientList();
+     const apiClientList = await getClientList();
      const vmClientList = mapItemListFromApiToVm(apiClientList);
      setClientList(vmClientList);
    } catch {
      setClientList(createNoTokenItemList());
    }
  };

  const handleLoadOrderList = async () => {
    try {
-     const apiOrderList = await api.getOrderList();
+     const apiOrderList = await getOrderList();
      const vmOrderList = mapItemListFromApiToVm(apiOrderList);
      setOrderList(vmOrderList);
    } catch {
      setOrderList(createNoTokenItemList());
    }
  };

...
```

- Use it on `logout`:

_./front/src/common-app/app-bar/app-bar.component.tsx_

```diff
...
- import { AuthContext, createEmptyUserSession } from '../auth';
+ import { AuthContext, createEmptyUserSession, useAuthRequest } from '../auth';
import * as api from './api';
import * as classes from './app-bar.styles';

export const AppBarComponent: React.FunctionComponent = () => {
  const { userSession, onChangeUserSession } = React.useContext(AuthContext);
  const history = useHistory();
+ const [logout] = useAuthRequest(api.logout);

  const handleLogout = async () => {
-   await api.logout();
+   await logout();
    onChangeUserSession(createEmptyUserSession());
    history.goBack();
  };

...
```

# Using CORS

- Let's update example to check if it's working with cors:

```bash
npm install cors --save
```

> NOTE: we can install @types/cors for Typescript.

_./back/src/core/servers/express.server.ts_

```diff
import express from 'express';
+ import cors from 'cors';
import cookieParser from 'cookie-parser';

export const createApp = () => {
  const app = express();

  app.use(express.json());
+ app.use(
+   cors({
+     credentials: true,
+     origin: '*',
+   })
+ );
  app.use(cookieParser());

  return app;
};

```

- Update front:

_./front/config/webapck/dev.js_

```diff
...
  devServer: {
    inline: true,
    host: 'localhost',
    port: 8080,
    stats: 'minimal',
    hot: true,
-   proxy: {
-     '/api': 'http://localhost:8081',
-   },
  },
```

- Update login request:

_./front/src/pods/login/api/login.api.ts_

```diff
import Axios from 'axios';
import { UserSession } from './login.api-model';

- const url = '/api/security/login';
+ const url = 'http://localhost:8081/api/security/login';

...

```

- Update list requests:

_./front/src/pods/list/api/list.api.ts_

```diff
import Axios from 'axios';
import { Item } from './list.api-model';

- const clientUrl = '/api/clients';
+ const clientUrl = 'http://localhost:8081/api/clients';
- const orderUrl = '/api/orders';
+ const orderUrl = 'http://localhost:8081/api/orders';

...

```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
