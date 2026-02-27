# 02 Fetching

In this example we are going to add data fetching capabilities using TanStack Router.

We will start from `01-routing`.

# Steps to build it

`npm install` to install previous sample packages:

```bash
npm install
```

Similar to `getServerSideProps` in Nextjs or `loaders` in Remix/React Router, TanStack Router provides a way to fetch data before rendering the route using `loader` functions and also provides a built-in SWR Caching mechanism.

> [More info about Loaders](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading)

Let's create a new route with data fetching capabilities, for that we will update our `cars` route to include a `loader` function that fetches car data from a mock API:

_./src/routes/cars/index.tsx_

```diff
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';

+ const getCarList = async () =>
+   await fetch('/api/cars').then((res) => res.json());

export const Route = createFileRoute('/cars/')({
+ loader: () => getCarList(),
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
+ const cars = Route.useLoaderData();

  return (
    <>
-     <div>Hello "/cars"!</div>
-     <Link to="/cars/$id" params={{ id: '1' }}>
-       Navigate to car 1
-     </Link>
+     <ul>
+       {cars.map((car) => (
+         <li key={car.id}>
+           <Link to="/cars/$id" params={{ id: car.id }}>
+             {car.name}
+           </Link>
+         </li>
+       ))}
+     </ul>
      <button onClick={() => navigate({ to: '/' })}>Go back to home</button>
    </>
  );
}

```

> You can play with the `staleTime` props on the route, or even in the global router config to adjust caching behavior.

But also we need to update the `vite.config.ts` to add the proxy for our mock API to avoid CORS issues:

_./vite.config.ts_

```diff
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
  ],
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
+ server: {
+   proxy: {
+     '/api': 'http://localhost:3001',
+   },
+ },
});

```

While Router has a simple built-in cache mechanism, for more advanced use-cases you can integrate [TanStack Query or similar libraries](https://tanstack.com/router/latest/docs/framework/react/guide/external-data-loading) to handle data fetching and caching.

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
