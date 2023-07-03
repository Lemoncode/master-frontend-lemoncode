# 01 Config

In this example we are going to add a basic setup needed to work with Nextjs

We will start from `00-boilerplate`.

# Steps to build it

`npm install` to install previous sample packages:

```bash
npm install
```

Install necessary libraries.

```bash
npm install next --save
```

> [Or using create-next-app](https://nextjs.org/docs/getting-started/installation)

Now, we can add the necessary npm scripts:

_./package.json_

```diff
  "scripts": {
+   "start": "next dev",
    "start:api-server": "cd api-server && npm run mock-server",
    "postinstall": "cd ./api-server && npm install",
    "clean": "rimraf .next"
  },
```

Before Nextjs 13, we used to create pages inside the `pages` folder and the rest of our files with our custom project structure. Now, with the new version, we must place all our files inside the `app` folder and every component will be a `React Server Component` by default.

It's required create a `root layout` inside `app/layout.tsx` with the required <html> and <body> tags:

_./app/layout.tsx_

```jsx
import React from 'react';

interface Props {
  children: React.ReactNode;
}

const RootLayout = (props: Props) => {
  const { children } = props;
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
```

Create the `root page`:

_./app/page.tsx_

```jsx
import React from 'react';

const RootPage = () => {
  return <h2>Hello from Nextjs</h2>;
};

export default RootPage;
```

Run `start`:

```bash
npm start
```

> Open `http://localhost:3000/`
>
> NOTE: Since we are using typescript, nextjs add automatically `tsconfig.json`, `next-env.d.ts` files with default values and install `@types/node` for us.

This is great to work with Nextjs in dev mode, but we need to add more commands to works with production mode:

_./package.json_

```diff
  "scripts": {
    "start": "next dev",
+   "build": "next build",
+   "start:prod": "next start -p 8080",
    ...
  },
```

> Default PORT in prod mode is 3000 too.

Run `build` and `start:prod`:

```bash
npm run build
npm run start:prod
```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
