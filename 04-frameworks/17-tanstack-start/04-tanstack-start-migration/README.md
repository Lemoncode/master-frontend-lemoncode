# 04 TanStack Start migration

In this example we are going to migrate our previous TanStack Router example to TanStack Start, which is a framework that combines Vite, TanStack Router, and other TanStack libraries for building SSR applications.

We will start from `03-boilerplate`.

# Steps to build it

`npm install` to install previous sample packages:

```bash
npm install
```

Install TanStack Start:

```bash
npm uninstall @tanstack/router-plugin

npm install @tanstack/react-start --save
```

> The `@tanstack/router-plugin` is not needed anymore as TanStack Start has built-in support for TanStack Router.
>
> [Quick Start Guide](https://tanstack.com/start/latest/docs/framework/react/quick-start)
>
> [Build from Scratch](https://tanstack.com/start/latest/docs/framework/react/build-from-scratch)

Update `vite.config.ts` to use TanStack Start plugin:

_./vite.config.ts_

```diff
- import { tanstackRouter } from '@tanstack/router-plugin/vite';
+ import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
-   tanstackRouter({
-     target: 'react',
-     autoCodeSplitting: true,
-   }),
+   tanstackStart(),
    react(),
  ],
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
- server: {
-   proxy: {
-     '/api': 'http://localhost:3001',
-   },
- },
});
```

Since TanStack Start handles routing for server-side and client-side, we need to move the router configuration to a dedicated file:

_./src/router.ts_

```tsx
import { createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';

export function getRouter() {
  return createRouter({
    routeTree,
    scrollRestoration: true,
  });
}
```

> `scrollRestoration` is optional, it enables automatic scroll position restoration when navigating simulating browser behavior.
>
> [Server entrypoint](https://tanstack.com/start/latest/docs/framework/react/guide/server-entry-point)
>
> [Client entrypoint](https://tanstack.com/start/latest/docs/framework/react/guide/client-entry-point)

If we run the app now, we should see it partially working:

```bash
npm start
```

However, we need to remove the SPA entrypoints (index.html and index.tsx) and move this configuration to the **\_\_root.tsx** file:

- Remove `./src/index.tsx`
- Remove `./index.html`

And move the HTML configuration to the root route:

_./src/routes/\_\_root.tsx_

```diff
import {
- Outlet,
  createRootRoute,
+ HeadContent,
+ Scripts,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import * as React from 'react';
+ import normalizeCss from 'normalize.css?url';
+ import materialIcons from './material-icons.css?url';

export const Route = createRootRoute({
+ head: () => ({
+   meta: [
+     { charSet: 'utf-8' },
+     { name: 'viewport', content: 'width=device-width, initial-scale=1' },
+     { title: 'Rent a car' },
+   ],
+   links: [
+     { rel: 'icon', type: 'image/png', href: '/home-logo.png' },
+     { rel: 'stylesheet', href: normalizeCss },
+     { rel: 'stylesheet', href: materialIcons },
+   ],
+ }),
- component: RootComponent,
+ shellComponent: RootComponent,
});

- function RootComponent() {
+ function RootComponent({ children }: { children: React.ReactNode }) {
  return (
-   <React.Fragment>
-     <div>Hello "__root"!</div>
-     <Outlet />
-     <TanStackRouterDevtools />
-   </React.Fragment>
+   <html lang="en">
+     <head>
+       <HeadContent />
+     </head>
+     <body>
+       <main>{children}</main>
+       <TanStackRouterDevtools />
+       <Scripts />
+     </body>
+   </html>
  );
}

```

> [Application Root](https://tanstack.com/start/latest/docs/framework/react/build-from-scratch#the-root-of-your-application)
>
> [Import global CSS styles](https://tanstack.com/start/latest/docs/framework/react/guide/tailwind-integration#import-the-css-file-in-your-__roottsx-file)
>
> [Vite URL importing](https://vite.dev/guide/assets#explicit-url-imports)

As we saw we cannot resolve the car list fetching because we removed the proxy configuration from `vite.config.ts`. Let's add an environment variable to define the API URL:

_./.env.local_

```env
BASE_API_URL=http://localhost:3001/api
BASE_PICTURES_URL=http://localhost:3001

```

And update the route loader to use this environment variable:

_./src/routes/cars/index.tsx_

```diff
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
+ import { api } from '#pods/car-list';

- const getCarList = async () =>
-   await fetch('/api/cars').then((res) => res.json());

export const Route = createFileRoute('/cars/')({
- loader: () => getCarList(),
+ loader: () => api.getCarList(),
  component: RouteComponent,
});
...

```

It looks similar to the SPA version, but now we have SSR capabilities, check it by opening the browser dev tools and see the Network tab, the initial HTML response should contain the car list data.

We can navigate to car details and see that working in SPA mode after the initial load. So, if we come back to the car list, it fails to fetch the data again because the env variables are not available in the browser by default. We need to expose them by prefixing them with `VITE_` or with a custom prefix configured in `vite.config.ts`:

> It means that loaders functions run on the server and the client
>
> [Isomorphic by default](https://tanstack.com/start/latest/docs/framework/react/guide/execution-model#core-principle-isomorphic-by-default)

_./.env.local_

```diff
- BASE_API_URL=http://localhost:3001/api
+ PUBLIC_BASE_API_URL=http://localhost:3001/api
- BASE_PICTURES_URL=http://localhost:3001
+ PUBLIC_BASE_PICTURES_URL=http://localhost:3001

```

_./vite.config.ts_

```diff
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [tanstackStart(), react()],
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
+ envPrefix: 'PUBLIC_',
});

```

_./src/core/env.constants.ts_

```diff
export const ENV = {
  BASE_API_URL:
-   process.env.BASE_API_URL ||
+   process.env.PUBLIC_BASE_API_URL ||
+   import.meta.env.PUBLIC_BASE_API_URL ||
    '',
  BASE_PICTURES_URL:
-   process.env.BASE_PICTURES_URL ||
+   process.env.PUBLIC_BASE_PICTURES_URL ||
+   import.meta.env.PUBLIC_BASE_PICTURES_URL ||
    '',
};

```

> [Vite Env Variables](https://vite.dev/guide/env-and-mode)

But if we want to execute it only in the server we can [use server functions](https://tanstack.com/start/latest/docs/framework/react/guide/server-functions):

_./src/pods/car-list/car-list.api.ts_

```diff
import { ENV } from '#core/constants';
import { Car } from './car-list.api-model';
+ import { createServerFn } from '@tanstack/react-start';

const url = `${ENV.BASE_API_URL}/cars`;

- export const getCarList =
+ export const getCarList = createServerFn().handler(
  async (): Promise<Car[]> =>
    await fetch(url).then((response) => response.json())
+ );

```

Remove the environment variable prefixing:

_./.env.local_

```diff
- PUBLIC_BASE_API_URL=http://localhost:3001/api
+ BASE_API_URL=http://localhost:3001/api
PUBLIC_BASE_PICTURES_URL=http://localhost:3001

```

_./src/core/env.constants.ts_

```diff
export const ENV = {
- BASE_API_URL:
-   process.env.PUBLIC_BASE_API_URL ||
+   process.env.BASE_API_URL ||
-   import.meta.env.PUBLIC_BASE_API_URL ||
    '',
...

```

> Check the Network tab in the browser dev tools, we should see that an special request is made to fetch the car list data from the server function endpoint.

Let's change the routes to apply styles and components that we already have in pods:

_./src/routes/cars/route.tsx_

```diff
- import { createFileRoute, Outlet } from '@tanstack/react-router';
+ import { createFileRoute, Link, Outlet } from '@tanstack/react-router';
+ import classes from './route.module.css';

export const Route = createFileRoute('/cars')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
-     <div style={{ background: 'teal' }}>Common layout</div>
+     <nav className={classes.nav}>
+       <Link className={classes.link} to="/">
+         <img src="/home-logo.png" alt="logo" width={32} height={23} />
+       </Link>
+       <h1 className={classes.title}>Rent a car</h1>
+     </nav>
+     <div className={classes.content}>
        <Outlet />
+     </div>
    </>
  );
}

```

> [Migrating from Nextjs Guide](https://tanstack.com/start/latest/docs/framework/react/migrate-from-next-js)
>
> [CSS Modules FOUC (flash of unstyled content) issue still open](https://github.com/TanStack/router/issues/3023#issuecomment-2689163745)

Update the car list page:

_./src/routes/cars/index.tsx_

```diff
- import { api } from '#pods/car-list';
+ import { api, CarList, mapCarListFromApiToVm } from '#pods/car-list';
- import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
+ import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/cars/')({
+ head: () => ({
+   meta: [{ title: 'Rent a car - Car list' }],
+ }),
  loader: () => api.getCarList(),
  component: RouteComponent,
});

function RouteComponent() {
- const navigate = useNavigate();
  const cars = Route.useLoaderData();

- return (
-   <>
-     <ul>
-       {cars.map((car) => (
-         <li key={car.id}>
-           <Link to="/cars/$id" params={{ id: car.id }}>
-             {car.name}
-           </Link>
-         </li>
-       ))}
-     </ul>
-     <button onClick={() => navigate({ to: '/' })}>Go back to home</button>
-   </>
- );
+ return <CarList carList={mapCarListFromApiToVm(cars)} />;
}

```

> [Head Management](https://tanstack.com/router/latest/docs/framework/react/guide/path-params#seo-and-canonical-urls)

Update the car details page:

_./src/routes/cars/$id.tsx_

```diff
+ import { api, Car, mapCarFromApiToVm } from '#pods/car';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/cars/$id')({
+ loader: ({ params }) => api.getCar({ data: { id: params.id } }),
+ head: ({ loaderData }) => ({
+   meta: [{ title: `Rent a car - Car ${loaderData?.name} details` }],
+ }),
  component: RouteComponent,
});

function RouteComponent() {
- const { id } = Route.useParams();
+ const car = Route.useLoaderData();
- return <div>Car id={id}</div>;
+ return <Car car={mapCarFromApiToVm(car)} />;
}

```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
