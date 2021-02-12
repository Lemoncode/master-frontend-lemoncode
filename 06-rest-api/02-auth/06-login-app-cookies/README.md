# 06 Login App Cookies

In this example we will implement security and redirect to login page if is not authorized using a JWT token in Cookies.

# Steps to build it

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

- Let's install `cookie-parser` to save token in a cookie (backend project):

```bash
npm install cookie-parser --save
```

- Configure it:

_./back/src/core/servers/express.server.ts_

```diff
import express from 'express';
+ import cookieParser from 'cookie-parser';

export const createApp = () => {
  const app = express();

  app.use(express.json());
+ app.use(cookieParser());
  return app;
};

```

- Remove `token` from body:

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

- Update login method:

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

+     res.cookie(headerConstants.authorization, token);
      res.send(userSession);
    } else {
      res.sendStatus(401);
    }
  })

```

- Add cookie options:

_./back/src/pods/security/security.constants.ts_

```diff
+ import { CookieOptions } from 'express';
+ import { envConstants } from 'core/constants';

export const jwtSignAlgorithm = 'HS256';

+ export const cookieOptions: CookieOptions = {
+   httpOnly: true,
+   secure: envConstants.isProduction,
+ };

```
_./back/src/pods/security/security.api.ts_

```diff
...
import { jwtMiddleware } from './security.middlewares';
- import { jwtSignAlgorithm } from './security.constants';
+ import { jwtSignAlgorithm, cookieOptions } from './security.constants';
...

  .post('/login', async (req, res) => {
    const { user, password } = req.body;
    const currentUser = userList.find(
      (u) => u.userName == user && u.password === password
    );

    if (currentUser) {
      const userSession = createUserSession(currentUser);
      const token = createToken(currentUser);

-     res.cookie(headerConstants.authorization, token);
+     res.cookie(headerConstants.authorization, token, cookieOptions);
      res.send(userSession);
    } else {
      res.sendStatus(401);
    }
  })

```

- Update security middleware to read cookies:

_./back/src/pods/security/security.middlewares.ts_

```diff
import { Request } from 'express';
import expressJwt from 'express-jwt';
import { envConstants, headerConstants } from 'core/constants';
import { jwtSignAlgorithm } from './security.constants';

export const jwtMiddleware = expressJwt({
  secret: envConstants.TOKEN_AUTH_SECRET,
  algorithms: [jwtSignAlgorithm],
  getToken: (req: Request) => {
-   const tokenWithBearer = req.headers
+   const tokenWithBearer = req.cookies
-     ? (req.headers[headerConstants.authorization] as string)
+     ? (req.cookies[headerConstants.authorization] as string)
      : '';

    const [, token] = tokenWithBearer.split(`${headerConstants.bearer} `) || [];

    return token;
  },
});

```

- Implement logout method:

_./back/src/pods/security/security.api.ts_

```diff
...
  .post('/logout', jwtMiddleware, async (req, res) => {
    // NOTE: We cannot invalidate token using jwt libraries.
    // Different approaches:
    // - Short expiration times in token
    // - Black list tokens on DB
+   res.clearCookie(headerConstants.authorization);
    res.sendStatus(200);
  });
```

- Notice that we don't need to update the front code to run example.


# Using CORS


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

## Cookie expiration

Right now, cookie expires when users close the browser. We could add some expiration time:

_./back/src/pods/security/security.constants.ts_

```diff
import { CookieOptions } from 'express';
import { envConstants } from 'core/constants';

export const jwtSignAlgorithm = 'HS256';

- export const cookieOptions: CookieOptions = {
-   httpOnly: true,
-   secure: envConstants.isProduction
- };

+ export const getCookieOptions = (expires: Date): CookieOptions => ({
+   httpOnly: true,
+   secure: envConstants.isProduction,
+   expires,
+ });

```

_./back/src/pods/security/security.api.ts_

```diff
...
- import { jwtSignAlgorithm, cookieOptions } from './security.constants';
+ import { jwtSignAlgorithm, getCookieOptions } from './security.constants';

...

.post('/login', async (req, res) => {
    const { user, password } = req.body;
    const currentUser = userList.find(
      (u) => u.userName == user && u.password === password
    );

    if (currentUser) {
      const userSession = createUserSession(currentUser);
      const token = createToken(currentUser);
+     const expires = new Date();
+     expires.setDate(new Date().getDate() + 1); // Add one day

      res.cookie(
        headerConstants.authorization,
        token,
-       cookieOptions
+       getCookieOptions(expires)
      );
      res.send(userSession);
    } else {
      res.sendStatus(401);
    }
  })

```

## Cookie without httpOnly

If we want to access a cookie's value from JavaScript, we have to:

_./back/src/pods/security/security.constants.ts_

```diff
import { CookieOptions } from 'express';
import { envConstants } from 'core/constants';

export const jwtSignAlgorithm = 'HS256';

export const cookieOptions: CookieOptions = {
- httpOnly: true,
+ httpOnly: false,
  secure: envConstants.isProduction,
};

```

- Now we could write this code in browser console:

```
document.cookie
```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
