# 01 Config

In this example we are going to add a basic setup needed to work with Nextjs

We will start from `00-boilerplate`.

# Steps to build it

- `npm install` to install previous sample packages:

```bash
npm install
```

- Install necessary libraries.

```bash
npm install next --save
npm install @types/node --save-dev
```

> [Or using create-next-app](https://nextjs.org/docs/getting-started)
>
> [Most of the new Nextjs v13 features are in beta or alpha](https://nextjs.org/blog/next-13)
- Now, we can add the necessary npm scripts:

_./package.json_

```diff
  "scripts": {
+   "start": "next dev",
    "start:api-server": "cd api-server && npm run mock-server",
    "postinstall": "cd ./api-server && npm install",
    "clean": "rimraf .next"
  },
```

- Before run this example, we need to create an index page:

_./src/pages/index.tsx_

```javascript
import React from 'react';

const HomePage = () => {
  return <h2>Hello from Nextjs</h2>;
};

export default HomePage;

```

- Run `start`:

```bash
npm start
```

> NOTE: Since we are using typescript, nextjs add automatically `tsconfig.json`, `next-env.d.ts` files with default values.

- This is great to work with Nextjs in dev mode, but we need to add more commands to works with production mode:

_./package.json_

```diff
  "scripts": {
    "start": "next dev",
+   "build": "npm run clean && next build",
+   "start:prod": "next start -p 8080",
    ...
  },
```

> Default PORT in prod mode is 3000 too.

- Run `build` and `start:prod`:

```bash
npm run build
npm run start:prod
```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
