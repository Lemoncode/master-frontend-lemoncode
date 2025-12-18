# 05 API Routes

In this example, we will migrate our previous API server to use TanStack Start API Routes.

# Steps to build it

`npm install` to install previous sample packages:

```bash
npm install
```

TanStack Start provides a way to create [API routes](https://tanstack.com/start/latest/docs/framework/react/guide/server-routes) that can be used in your application without needing a separate backend server. This is particularly useful for small to medium-sized applications or when you want to keep everything within a single codebase.

First, let's move the API logic from our previous server to the `src` folder.

- Copy the contents of `./api-server/src/mock-data.ts` to `./src/db/mock-data.ts`.
- Add the barrel file `./src/db/index.ts` with the content `export * from './mock-data';`
- Copy cars images from `./api-server/public` to `./public`.
- Remove the `./api-server` folder.

Update the `package.json`:

_./package.json_

```diff
...
  "scripts": {
-   "start": "run-p -l start:dev start:api-server",
+   "start": "vite",
-   "start:dev": "vite",
-   "start:api-server": "cd api-server && npm run mock-server",
-   "postinstall": "cd ./api-server && npm install"
  },
...
```

Update the environment variables:

_./.env.local_

```diff
- BASE_API_URL=http://localhost:3001/api
+ BASE_API_URL=http://localhost:5173/api
- PUBLIC_BASE_PICTURES_URL=http://localhost:3001
+ PUBLIC_BASE_PICTURES_URL=http://localhost:5173

```

Run the development server:

```bash
npm start
```

And let's to update the API requests. You can create an API route by defining [the `server` prop](https://tanstack.com/start/latest/docs/framework/react/guide/server-routes#server-routes-and-app-routes) on a page or layout component or by creating a dedicated file in another location, for example, in a `routes/api` folder.

_./src/routes/api/cars/index.ts_

```ts
import { cars } from '#db';
import { createFileRoute } from '@tanstack/react-router';
import { json } from '@tanstack/react-start';

export const Route = createFileRoute('/api/cars')({
  server: {
    handlers: {
      GET: async () => {
        return json(cars);
      },
    },
  },
});
```

Let's update the Car details API route:

_./src/routes/api/cars/$id.ts_

```ts
import { cars } from '#db';
import { createFileRoute } from '@tanstack/react-router';
import { json } from '@tanstack/react-start';

export const Route = createFileRoute('/api/cars/$id')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        return json(cars.find((c) => c.id === params.id));
      },
    },
  },
});
```

And finally, update the car booking API route:

_./src/routes/api/cars/$id.ts_

```diff
import { cars } from '#db';
import { createFileRoute } from '@tanstack/react-router';
import { json } from '@tanstack/react-start';

export const Route = createFileRoute('/api/cars/$id')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        return json(cars.find((c) => c.id === params.id));
      },
+     PATCH: async ({ params, request }) => {
+       const car = await request.json();
+       const index = cars.findIndex((c) => c.id === params.id);
+       if (index !== -1) {
+         cars[index] = { ...cars[index], isBooked: car.isBooked };
+       }
+       return new Response(null, { status: 204 });
+     },
    },
  },
});

```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
