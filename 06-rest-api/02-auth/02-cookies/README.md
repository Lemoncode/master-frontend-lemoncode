# 02 Cookies

In this example we will login an user using a JWT token in Cookies and load client and order collections.

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

- Start `front` app:

```bash
cd ./front
npm start
```

- We don't need CORS because we are using `webpack's proxy`, so it looks like same domain:

_./front/config/webpack/dev.js_

```javascript
...
 devServer: {
...
    proxy: {
      '/api': 'http://localhost:8081',
    },
  },
```

## Demo

- Open Chrome Dev tools > Network tab.

- Login with `admin` credentials

- Open Chrome Dev tools > Application tab > Cookies

- Load client list

- Load order list

- Logout

- Navigate to `http://localhost:8080/#/list` without LOGIN

- Load client list.

## Demo open new tab

- Open Chrome Dev tools > Network tab.

- Login with `admin` credentials

- Load client list in new tab.

> NOTE: Right now, the cookie expires when we close all brower's tabs.
> Check Browser lock icon > Cookies

## Login flow

Backend:

  - `back/src/core/servers/express.server.ts`
  - `back/src/app.ts`
  - `back/src/pods/security/security.api.ts`
  - `back/src/pods/security/security.constants.ts`
  - Check user credentials.
  - Create `jwt` by user credentials.
  - Return token in cookie httpOnly.

Frontend:

  - `front/src/pods/login/login.container.tsx`
  - `front/src/pods/login/login.hooks.ts`
  - `front/src/pods/login/api/login.api.ts`
  - `front/src/core/api/api/api.helpers.ts`: Deleted
  - `front/src/common-app/auth/auth.context.ts`
  - `front/src/common-app/app-abr/app-bar.component.tsx`

## Load list flow

Backend:

  - `back/src/app.ts`
  - `back/src/pods/security/security.middlewares.ts`: `req.cookies`.
  - `back/src/pods/client/client.api.ts`
  - `back/src/pods/order/order.api.ts`

Frontend: 

  - `front/src/pods/list/list.container.tsx`
  - `front/src/pods/list/api/list.api.tsx`

## Logout flow

Backend:

  - `back/src/app.ts`: We are not using `jwtMiddleware` on root security api.
  - `back/src/pods/security/security.api.ts`: clear cookie

Frontend: 

  - `front/src/common-app/app-bar/app-bar.component.tsx`
  - `front/src/common-app/app-bar/app-bar.api.tsx`

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
