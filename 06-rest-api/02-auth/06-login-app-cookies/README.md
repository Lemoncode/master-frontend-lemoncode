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

- Update login method:

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
+     const token = createToken(currentUser);

+     res.cookie(headerConstants.authorization, token, cookieOptions);
      res.send(userSession);
    } else {
      res.sendStatus(401);
    }
  })

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

- Notice that we don't need to update the front code to run example.

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
