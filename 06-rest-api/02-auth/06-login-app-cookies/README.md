# 06 Login App Cookies

In this example we will implement security and redirect to login page if is not authorized using a JWT token in Cookies.

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

## Configure cookies

Let's install `cookie-parser` to save token in a cookie (backend project):

```bash
npm install cookie-parser --save
npm install @types/cookie-parser --save-dev
```

Configure it:

_./back/src/core/servers/rest-api.server.ts_

```diff
import express from 'express';
import cors from 'cors';
+ import cookieParser from 'cookie-parser';

export const createRestApiServer = () => {
  const app = express();
  app.use(express.json());
  app.use(
    cors({
      credentials: true,
      origin: '*',
    })
  );
+ app.use(cookieParser());

  return app;
};

```

Remove `token` from body:

_./back/src/pods/security/security.api-model.ts_

```diff
...
export interface UserSession {
  firstname: string;
  lastname: string;
- token: string;
}

```

_./back/src/pods/security/security.api.ts_

```diff
...
const createUserSession = (user: User): UserSession => {
  return {
    firstname: user.firstname,
    lastname: user.lastname,
-   token: createToken(user),
  };
};

```

Update login method:

_./back/src/pods/security/security.api.ts_

```diff
...

  .post('/login', async (req, res) => {
    const { user, password } = req.body;
    const currentUser = userList.find(
      (u) => u.userName == user && u.password === password
    );

    if (currentUser) {
      const userSession = createUserSession(currentUser);
+     const token = createToken(currentUser);
+     res.cookie(HEADERS.AUTHORIZATION, token);
      res.send(userSession);
    } else {
      res.sendStatus(401);
    }
  })

```

Add cookie options:

_./back/src/pods/security/security.constants.ts_

```diff
+ import { CookieOptions } from 'express';
+ import { ENV } from '#core/constants/index.js';

export const JWT_SIGN_ALGORITHM = 'HS256';

+ export const COOKIE_OPTIONS: CookieOptions = {
+   httpOnly: true,
+   secure: ENV.IS_PRODUCTION,
+ };

```

_./back/src/pods/security/security.api.ts_

```diff
...
import { jwtMiddleware } from './security.middlewares';
- import { JWT_SIGN_ALGORITHM } from './security.constants.js';
+ import { JWT_SIGN_ALGORITHM, COOKIE_OPTIONS } from './security.constants.js';
...

  .post('/login', async (req, res) => {
    const { user, password } = req.body;
    const currentUser = userList.find(
      (u) => u.userName == user && u.password === password
    );

    if (currentUser) {
      const userSession = createUserSession(currentUser);
      const token = createToken(currentUser);
-     res.cookie(HEADERS.AUTHORIZATION, token);
+     res.cookie(HEADERS.AUTHORIZATION, token, COOKIE_OPTIONS);
      res.send(userSession);
    } else {
      res.sendStatus(401);
    }
  })

```

Update security middleware to read cookies:

_./back/src/pods/security/security.middlewares.ts_

```diff
import { Request } from 'express';
import expressJwt from 'express-jwt';
import { ENV, HEADERS } from '#core/constants/index.js';
import { JWT_SIGN_ALGORITHM } from './security.constants.js';

export const jwtMiddleware = expressJwt({
  secret: ENV.TOKEN_AUTH_SECRET,
  algorithms: [JWT_SIGN_ALGORITHM],
  getToken: (req: Request) => {
-   const tokenWithBearer = req.headers
+   const tokenWithBearer = req.cookies
-     ? (req.headers[HEADERS.AUTHORIZATION] as string)
+     ? (req.cookies[HEADERS.AUTHORIZATION] as string)
      : '';

    const [, token] = tokenWithBearer.split(`${HEADERS.BEARER} `) || [];

    return token;
  },
});

```

Implement logout method:

_./back/src/pods/security/security.api.ts_

```diff
...
  .post('/logout', jwtMiddleware, async (req, res) => {
    // NOTE: We cannot invalidate token using jwt libraries.
    // Different approaches:
    // - Short expiration times in token
    // - Black list tokens on DB
+   res.clearCookie(HEADERS.AUTHORIZATION);
    res.sendStatus(200);
  });
```

> Try to login and get list using the frontend app.

We need extra configuration to make it works Cookies with CORS:

_./back/src/core/servers/rest-api.server.ts_

```diff
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

export const createRestApiServer = () => {
  const app = express();
  app.use(express.json());
  app.use(
    cors({
      credentials: true,
-     origin: '*',
+     origin: 'http://localhost:8080',
    })
  );
  app.use(cookieParser());

  return app;
};

```

And update the frontend requests like:

_./front/src/pods/login/api/login.api.ts_

```diff
import axios from 'axios';
import { setHeader, headerConstants } from '#core/api';
import { UserSession } from './login.api-model';

const url = 'http://localhost:3000/api/security/login';

export const isValidLogin = async (
  user: string,
  password: string
): Promise<UserSession> => {
  const { data } = await axios.post<UserSession>(
    url,
    { user, password },
+   { withCredentials: true }
  );
  setHeader(headerConstants.authorization, data.token);
  return data;
};

```

> If you are using `fetch` instead of `axios`, you should add `credentials: 'include'` to the request options.
>
> fetch(url, { credentials: 'include', ... });

Another option is restoring proxy configuration:

_./front/vite.config.ts_

```diff
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
+ server: {
+   proxy: {
+     '/api': 'http://localhost:3000',
+   },
+ },
});

```

_./front/src/pods/login/api/login.api.ts_

```diff
...

- const url = 'http://localhost:3000/api/security/login';
+ const url = '/api/security/login';

...
  const { data } = await axios.post<UserSession>(
    url,
    { user, password },
-   { withCredentials: true }
  );

```

_./front/src/pods/list/api/list.api.ts_

```diff
...

- const clientUrl = 'http://localhost:3000/api/clients';
+ const clientUrl = '/api/clients';
- const orderUrl = 'http://localhost:3000/api/orders';
+ const orderUrl = '/api/orders';

...

```

_./front/src/core/app-bar/api/app-bar.api.ts_

```diff
...

- const url = 'http://localhost:3000/api/security/logout';
+ const url = '/api/security/logout';

...

```

## Cookie without httpOnly

If we want to access a cookie's value from JavaScript, we have to:

_./back/src/pods/security/security.constants.ts_

```diff
import { CookieOptions } from 'express';
import { ENV } from '#core/constants/index.js';

export const JWT_SIGN_ALGORITHM = 'HS256';

export const COOKIE_OPTIONS: CookieOptions = {
- httpOnly: true,
+ httpOnly: false,
  secure: ENV.IS_PRODUCTION,
};

```

Now we could write this code in browser console:

```
document.cookie
```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
