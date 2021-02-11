# 01 Headers

In this example we will login an user using a JWT token in Http Headers and load client and order collections.

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

- Load client list

- Load order list

- Logout

- Navigate to `http://localhost:8080/#/list` without LOGIN

- Load client list.

## Demo open new tab

- Open Chrome Dev tools > Network tab.

- Login with `admin` credentials

- Load client list in new tab.

## Login flow

Backend:

- `back/src/core/servers/express.server.ts`
- `back/src/app.ts`
- `back/src/pods/security/security.api.ts`
- Check user credentials.
- Create `jwt` by user credentials.
- Return token in body.

> NOTE: [Verify jwt token](https://jwt.io/)

Frontend:

- `front/src/pods/login/login.container.tsx`
- `front/src/pods/login/login.hooks.ts`
- `front/src/pods/login/api/login.api.ts`
- `front/src/core/api/api/api.helpers.ts`
- `front/src/common-app/auth/auth.context.ts`
- `front/src/common-app/app-abr/app-bar.component.tsx`

## Load list flow

Backend:

- `back/src/app.ts`
- `back/src/pods/security/security.middlewares.ts`
- `back/src/pods/client/client.api.ts`
- `back/src/pods/order/order.api.ts`

Frontend:

- `front/src/pods/list/list.container.tsx`
- `front/src/pods/list/api/list.api.tsx`

## Logout flow

Backend:

- `back/src/app.ts`: We are not using `jwtMiddleware` on root security api.
- `back/src/pods/security/security.api.ts`

Frontend:

- `front/src/common-app/app-bar/app-bar.component.tsx`
- `front/src/common-app/app-bar/app-bar.api.tsx`: clear header.

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
