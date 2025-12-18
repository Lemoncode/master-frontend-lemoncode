# 01 Routing

In this example we are going to add a basic routing setup using TanStack Router.

We will start from `00-boilerplate`.

# Steps to build it

`npm install` to install previous sample packages:

```bash
npm install
```

Install necessary libraries.

```bash
npm install @tanstack/react-router --save

npm install @tanstack/router-plugin @tanstack/react-router-devtools --save-dev
```

> [More info about TanStack Router Quick Start](https://tanstack.com/router/latest/docs/framework/react/quick-start)
>
> [Manual setup](https://tanstack.com/router/latest/docs/framework/react/installation/manual)

Configure the router plugin:

_./vite.config.ts_

```diff
+ import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
+   tanstackRouter({
+     target: 'react',
+     autoCodeSplitting: true,
+   }),
    react(),
  ],
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
});

```

> target: 'react' or 'solid' depending on the framework used.
>
> autoCodeSplitting: true to enable automatic code splitting based on routes.

Let's start the application:

```bash
npm start
```

And we should see some warning in the console about missing router configuration. Let's create it.

- Create a file in the route: `./src/routes/__root.tsx`. Automatically the router plugin will write the necessary code to configure the router.

We can update it with the `dev tools` configuration:

_./src/routes/\_\_root.tsx_

```diff
import { Outlet, createRootRoute } from '@tanstack/react-router'
+ import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import * as React from 'react'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <React.Fragment>
      <div>Hello "__root"!</div>
      <Outlet />
+     <TanStackRouterDevtools />
    </React.Fragment>
  )
}

```

> the `Outlet` component is necessary to render child routes.

Notice that the router plugin also created the `./src/routeTree.gen.ts` file that contains all the route types that we are going to create.

> We also have a `.vscode/settings.json` file that configures this file as read-only to avoid accidental changes and it is excluded from typescript watching.

Let's use this router in the main application file:

_./src/index.tsx_

```diff
import React from 'react';
import { createRoot } from 'react-dom/client';
+ import { RouterProvider, createRouter } from '@tanstack/react-router';

+ import { routeTree } from './routeTree.gen';
+ const router = createRouter({
+   routeTree,
+ });
+ // Register the router instance for type safety
+ declare module '@tanstack/react-router' {
+   interface Register {
+     router: typeof router;
+   }
+ }

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
-   <h1>Welcome to Rent a Car!</h1>
+   <RouterProvider router={router} />
  </React.StrictMode>
);

```

Now we can create two route:

- The main route `src/routes/index.tsx`
- A second route `src/routes/cars.tsx`

And we have intellisense and type safety when navigating between them:

_./src/routes/index.tsx_

```diff
- import { createFileRoute } from '@tanstack/react-router'
+ import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
component: RouteComponent,
})

function RouteComponent() {
- return <div>Hello "/"!</div>
+ return (
+   <>
+     <div>Hello "/"!</div>
+     <Link to="/cars">Navigate to car list</Link>
+   </>
+ );
}

```

Also if we use the [useNavigate](https://tanstack.com/router/v1/docs/framework/react/api/router/useNavigateHook) hook we have type safety when navigating programmatically:

_./src/routes/cars.tsx_

```diff
- import { createFileRoute } from '@tanstack/react-router'
+ import { createFileRoute, useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/cars')({
  component: RouteComponent,
})

function RouteComponent() {
- return <div>Hello "/cars"!</div>
+ const navigate = useNavigate();

+ return (
+   <>
+     <div>Hello "/cars"!</div>
+     <button onClick={() => navigate({ to: '/' })}>Go back to home</button>
+   </>
+ );
}

```

If we need dynamic routes, we can create them using the `$param` syntax. Let's create the `cars` folder and move the previous `cars.tsx` file into it as `index.tsx`. Then create a new file `$id.tsx` for the dynamic route:

```
|routes/
|-- cars/
|----- $id.tsx ----------------> Route with param `/cars/:id`
|----- index.tsx --------------> Main route `/cars`
|----- route.tsx --------------> Shared route config for `/cars` routes
|-- __root.tsx
|-- index.tsx
```

_./src/routes/cars/$id.tsx_

```diff
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/cars/$id')({
  component: RouteComponent,
});

function RouteComponent() {
+ const { id } = Route.useParams();
- return <div>Hello "/cars/$id"!</div>
+ return <div>Car id={id}</div>;
}

```

> `import { useParams } from '@tanstack/react-router'` and `const { id } = useParams({from: '/cars/$id'})` if we don't have access to the Route object.

_./src/routes/cars/index.tsx_

```diff
- import { createFileRoute, useNavigate } from '@tanstack/react-router';
+ import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/cars/')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  return (
    <>
      <div>Hello "/cars"!</div>
+     <Link to="/cars/$id" params={{ id: '1' }}>
+       Navigate to car 1
+     </Link>
      <button onClick={() => navigate({ to: '/' })}>Go back to home</button>
    </>
  );
}

```

> Also check the params typing when using the `navigate` function.

Finally we can create a shared route config for all the `cars` routes:

_./src/routes/cars/route.tsx_

```diff
- import { createFileRoute } from '@tanstack/react-router'
+ import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/cars')({
  component: RouteComponent,
})

function RouteComponent() {
- return <div>Hello "/cars"!</div>
+ return (
+   <>
+     <div style={{ background: 'teal' }}>Common layout</div>
+     <Outlet />
+   </>
+ );
}

```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
