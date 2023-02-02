# 04 Static sites

Let's works with Nextjs using pages generated at build time.

We will start from `03-boilerplate`.

# Steps to build it

- `npm install` to install previous sample packages:

```bash
npm install
```

- We can render Nextjs pages in 3 modes:
  - Static Site Generation
  - Server Side Rendering
  - Client Side Rendering

> We can combine them

# Static Site Generation

## GetStaticProps

Pages are generated at build time, it means that it will fetch all necessary data from backend at build time.

- Recommended whenever possible because it's much faster than having server render the page on every request.
- The build time will be larger than SSR mode.
- Only available on page components.
- [When to use it](https://nextjs.org/docs/basic-features/data-fetching#when-should-i-use-getstaticprops)

- We will fetch data from an API (`api-server`), so let's start this server on `start` command:

_./package.json_

```diff
  "scripts": {
-   "start": "next dev",
+   "start": "run-p -l start:dev start:api-server",
+   "start:dev": "next dev",
    ...
  },
```

- Take a look `pods/car-list/api/`, it's using a env variable.

- Let's create it:

_./.env.local_

```
BASE_API_URL=http://localhost:3001/api

```

> [Env variables in Nextjs](https://nextjs.org/docs/basic-features/environment-variables#loading-environment-variables)


- Update `.gitignore`:

```diff
node_modules
dist
coverage
.awcache
test-report.*
junit.xml
*.log
*.orig
.cache
.env
.next
.swc
+ .env.local
```

- Now, we will use this method to load car list on build time:

_./src/pages/cars.tsx_

```diff
import React from 'react';
- import { useRouter } from 'next/router';
+ import { GetStaticProps } from 'next';
import Head from 'next/head';
import { AppLayout } from 'layouts';
+ import { CarListContainer, api } from 'pods/car-list';

+ interface Props {
+   carList: api.Car[];
+ }

- const CarListPage = () => {
+ const CarListPage: React.FC<Props> = (props) => {
- const router = useRouter();
- const onNavigateBack = () => {
-   router.push('/'); // or router.back()
- };
+ const { carList } = props;
+ console.log(`Car list on component: `, { carList });

  return (
    <AppLayout>
      <Head>
        <title>Rent a car - Car list</title>
      </Head>
-     <h2>Car list page</h2>
-     <ul>
-       <li>Audi Q8</li>
-       <li>BMW X7</li>
-     </ul>
-     <button onClick={onNavigateBack}>Navigate to home</button>
+     <CarListContainer carList={carList} />
    </AppLayout>
  );
};

+ export const getStaticProps: GetStaticProps = async () => {
+   const carList = await api.getCarList();
+   console.log('Car list build time:', { carList });
+   return {
+     props: {
+       carList,
+     },
+   };
+ };

export default CarListPage;

```

> [getStaticProps](https://nextjs.org/docs/basic-features/data-fetching#getstaticprops-static-generation)

- Run in `prod` mode (two terminals):

```bash
npm run start:api-server

npm run build
```

- Stop `api-server` and run:

```bash
npm run start:prod
```

- In dev mode it's working as `server side rendering`. How we can use breakpoints on `getStaticProps` method if it's executing on server side? We need add a VSCode debug config or run it with `Javascript Debug Terminal`:

```bash
npm run start

```

> [Debugging docs](https://nextjs.org/docs/advanced-features/debugging)

- Now, if we want fix the image issue, we needs to create the `BASE_PICTURES_URL` env variable

_./.env.local_

```diff
  BASE_API_URL=http://localhost:3001/api
+ BASE_PICTURES_URL=http://localhost:3001

```

- Stop app and run again:

```bash
npm start
```

- It looks great, but if we navigate to some car details and the go back, the images will disappears. It's because Nextjs delegate to client render after the first load.

> NOTE: Same behaviour on prod mode (build + start:prod)

- The issue is that `envConstants.BASE_PICTURES_URL` is `undefined` on client site. It means that current `env variables` are availables only for backend. If we want to expose some variables to client side too:

_./.env.local_

```diff
- BASE_API_URL=http://localhost:3001/api
- BASE_PICTURES_URL=http://localhost:3001
+ NEXT_PUBLIC_BASE_API_URL=http://localhost:3001/api
+ NEXT_PUBLIC_BASE_PICTURES_URL=http://localhost:3001

```

> Prefix `NEXT_PUBLIC_`
>
> [Client side env](https://nextjs.org/docs/basic-features/environment-variables#exposing-environment-variables-to-the-browser)
>
> NOTE: We are using axios because we can fetch data with it on client and backend side.

_./src/common/constants/env.constants.ts_

```diff
export const envConstants = {
- BASE_API_URL: process.env.BASE_API_URL,
- BASE_PICTURES_URL: process.env.BASE_PICTURES_URL,
+ BASE_API_URL: process.env.NEXT_PUBLIC_BASE_API_URL,
+ BASE_PICTURES_URL: process.env.NEXT_PUBLIC_BASE_PICTURES_URL,
};

```

- Stop app and run again:

```bash
npm start
```

## GetStaticPaths

- If we need to define a list of pages to get availables at build time (like each `car details`), we can use `getStaticPaths`.

- Update car `page`:

_./src/pages/cars/\[carId\].tsx_

```diff
import React from 'react';
- import { useRouter } from 'next/router';
+ import { GetStaticProps } from 'next';
import Head from 'next/head';
import { AppLayout } from 'layouts';
+ import { CarContainer, api } from 'pods/car';

+ interface Props {
+   car: api.Car;
+ }

- const CarPage = () => {
+ const CarPage: React.FunctionComponent<Props> = (props) => {
- const router = useRouter();
+ const { car } = props;
  return (
    <AppLayout>
      <Head>
-       <title>Rent a car - Car {router.query.carId} details</title>
+       <title>Rent a car - Car {car?.name} details</title>
      </Head>
-     <h2>Car detail page</h2>
-     <p>{router.query.carId}</p>
+     <CarContainer car={car} />
    </AppLayout>
  );
};

+ export const getStaticProps: GetStaticProps = async (context) => {
+   const carId = context.params.carId as string;
+   const car = await api.getCar(carId);

+   return {
+     props: {
+       car,
+     },
+   };
+ };

export default CarPage;

```


- But if we run this code, which car details will be renders at build time. Run in `two` terminals:

```bash
npm run start:api-server

npm run build
```

- We need here to use [getStaticPaths](https://nextjs.org/docs/basic-features/data-fetching#getstaticpaths-static-generation) too:

_./src/pages/cars/\[carId\].tsx_

```diff
import React from 'react';
- import { GetStaticProps } from 'next';
+ import { GetStaticProps, GetStaticPaths } from 'next';
...

+ export const getStaticPaths: GetStaticPaths = async () => {
+   return {
+     paths: [
+       { params: { carId: '1' } },
+       { params: { carId: '2' } },
+       { params: { carId: '3' } },
+     ],
+     fallback: false, // 404 page for not included ids
+   };
+ };

export default CarPage;

```

- Run again:

```bash
npm run start:api-server

npm run build
```

> NOTE: check `json-server logs`.

- Run `prod` mode:

```bash
npm run start:prod
```

- Let's use `fallback: true`:

_./src/pages/cars/\[carId\].tsx_

```diff
...

export const getStaticProps: GetStaticProps = async (context) => {
  const carId = context.params.carId as string;
  const car = await api.getCar(carId);
+ console.log(`Fetch car: ${JSON.stringify(car, null, 2)}`);

  return {
    props: {
      car,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      { params: { carId: '1' } },
      { params: { carId: '2' } },
      { params: { carId: '3' } },
    ],
-   fallback: false, // 404 page for not included ids
+   fallback: true,
  };
};
```

- Run again:

```bash
npm run start:api-server
npm run build
npm run start:prod
```

- With `fallback true`, will fetch data on user request and add this new "static page" to the `pre-renders` one. It means that it will be fetch data only once. Check `.next/server/pages/cars`.

- What's if `api-server` has new data, let's use [Incremental Static Regeneration](https://nextjs.org/docs/basic-features/data-fetching#incremental-static-regeneration):

_./src/pages/cars.tsx_

```diff
...

export const getStaticProps: GetStaticProps = async () => {
  const carList = await api.getCarList();
  console.log('Car list build time:', { carList });

  return {
    props: {
      carList,
    },
+   // Next.js will attempt to re-generate the page:
+   // - When a request comes in
+   // - At most once every second
+   revalidate: 10, // In seconds
  };
};
```

- Run again:

```bash
npm run start:api-server
npm run build
npm run start:prod
```

- Open browser at `http://localhost:8080/cars` and then add a new car:

_./api-server/mock-data/data.json_

```diff
...
+   {
+     "id": "10",
+     "name": "New car",
+     "imageUrl": "/audi-q8.png",
+     "features": [],
+     "isBooked": false
+   }
```

- While we navigate to car details:(`/cars/1`, `/cars/2`,...`/cars/4`) it doesn't update the car list.

- If we refresh the `/cars` page again (F5) it pre-renders the `car page again` and show the new version (navigate to details and back again).

> It will works with Car Details too.

- Remove data:

_./api-server/mock-data/data.json_

```diff
...
-   {
-     "id": "10",
-     "name": "New car",
-     "imageUrl": "/vw-touran.png",
-     "features": [],
-     "isBooked": false
-   }
```

- For fix `image` on car details, we nee to add a `domain` to 'optimize images with `next/image` hosted in external service:

_./.env.local_

```diff
+ DOMAIN=localhost
- NEXT_PUBLIC_BASE_PICTURES_URL=http://localhost:3001
- NEXT_PUBLIC_BASE_PICTURES_URL=http://localhost:3001
+ NEXT_PUBLIC_BASE_PICTURES_URL=http://$DOMAIN:3001
+ NEXT_PUBLIC_BASE_PICTURES_URL=http://$DOMAIN:3001

```

_./next.config.js_

```javascript
module.exports = {
  images: {
    domains: [process.env.DOMAIN],
  },
};

```

> [Image domains](https://nextjs.org/docs/basic-features/image-optimization#domains)
>
> [Next config file](https://nextjs.org/docs/api-reference/next.config.js/introduction)

- Run app dev mode:

```bash
npm start
```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
