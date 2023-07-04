# 04 Static sites

Let's works with Nextjs using pages generated at build time.

We will start from `03-boilerplate`.

# Steps to build it

`npm install` to install previous sample packages:

```bash
npm install
```

We can render Nextjs pages in 3 modes:

- Static Site Generation
- Server Side Rendering
- Client Side Rendering

> We can combine them

# Static Site Generation

Pages are generated at build time, it means that it will fetch all necessary data from backend at build time.

- Recommended whenever possible because it's much faster than having server render the page on every request.
- The build time will be larger than SSR mode.
- Only available on `Server Components`.
- [More about static data fetching](https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic-rendering#static-data-fetching-default)

We will fetch data from an API (`api-server`), so let's start this server on `start` command:

_./package.json_

```diff
  "scripts": {
-   "start": "next dev",
+   "start": "run-p -l start:dev start:api-server",
+   "start:dev": "next dev",
    ...
  },
```

Take a look `app/cars/_api/car-list.api.ts`, it's using a env variable.

Let's create it:

_./.env.local_

```
BASE_API_URL=http://localhost:3001/api

```

> [Env variables in Nextjs](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)

Update `.gitignore`:

_./.gitignore_

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

Now, we will use this method to load car list on build time:

_./app/cars/page.tsx_

```diff
- 'use client';
import React from 'react';
- import { useRouter } from 'next/navigation';
+ import { Metadata } from 'next';
+ import { getCarList } from './_api';
+ import { CarList } from './_components';
+ import { mapCarListFromApiToVm } from './car-list.mappers';

+ export const metadata: Metadata = {
+   title: 'Rent a car - Car list',
+ };

- const CarListPage = () => {
+ const CarListPage = async () => {
-   const router = useRouter();
-   const onNavigateBack = () => {
-     router.push('/'); // or router.back()
-   };
+   const carList = await getCarList();
+   console.log('Car list at build time:', { carList });

-   return (
-     <>
-       <h2>Car list page</h2>
-       <ul>
-         <li>Audi Q8</li>
-         <li>BMW X7</li>
-       </ul>
-       <button onClick={onNavigateBack}>Navigate to home</button>
-     </>
-   );
+   return <CarList carList={mapCarListFromApiToVm(carList)} />;
  };

export default CarListPage;

```

Update `layout`:

_./app/cars/layout.tsx_

```diff
import React from 'react';
- import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import classes from './layout.module.css';

- export const metadata: Metadata = {
-   title: 'Rent a car - Car list',
- };

...

```

Run in `prod` mode (two terminals):

```bash
npm run start:api-server

npm run build
```

Stop `api-server` and run:

```bash
npm run start:prod
```

> Open browser on `http://localhost:8080/cars`.
>
> Check `.next/server/app/cars.html` file.
>
> Pending to fix images issue.

In dev mode it's working as `server side rendering`. How we can use breakpoints if it's executing on server side? We need add a VSCode debug config or run it with `Javascript Debug Terminal`:

```bash
npm start

```

> Open browser on `http://localhost:3000/cars`.
>
> [Debugging docs](https://nextjs.org/docs/advanced-features/debugging)

Now, if we want fix the image issue, we needs to create the `BASE_PICTURES_URL` env variable (check `app/cars/car-list.mappers.ts`)

_./.env.local_

```diff
  BASE_API_URL=http://localhost:3001/api
+ BASE_PICTURES_URL=http://localhost:3001

```

Stop app and run again:

```bash
npm start
```

> It looks great even if we navigate to another page and back to car list page.
>
> Same behaviour on prod mode (build + start:prod)
>
> [Client side env](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables#bundling-environment-variables-for-the-browser) for example using `'use client'`.

## Generate Static Params

If we need to define a list of pages to get availables at build time (like each `car details`), we can use [generateStaticParams](https://nextjs.org/docs/app/api-reference/functions/generate-static-params).

Update car `page`:

_./app/cars/\[carId\]/page.tsx_

```diff
import React from 'react';
import { Metadata } from 'next';
+ import { getCar } from './_api';
+ import { Car } from './_components';
+ import { mapCarFromApiToVm } from './car.mappers';

interface Props {
  params: { carId: string };
}

export const generateMetadata = async (props: Props): Promise<Metadata> => {
  const { params } = props;
  return {
    title: `Rent a car - Car ${params.carId} details`,
  };
};

- const CarPage = (props: Props) => {
+ const CarPage = async (props: Props) => {
    const { params } = props;
+   const car = await getCar(params.carId);
+   console.log('Car page', car);

-   return (
-     <>
-       <h2>Car detail page</h2>
-       <p>{params.carId}</p>
-     </>
-   );
+   return <Car car={mapCarFromApiToVm(car)} />;
  };

export default CarPage;

```

If we open `http://localhost:8080/cars/1` in `prod` mode, we notice that by default the car detail page is running on `SSR` mode.

```bash
npm run start:api-server

npm run build

npm run start:prod
```

> Check `.next/server/app/cars/[carId]`.
>
> Each time we refresh the page (F5) it will fetch the car details data.
>
> It will cache on routing navigation.

But if we run this code at build time, we need to use [generateStaticParams](https://nextjs.org/docs/app/api-reference/functions/generate-static-params) too:

_./app/cars/\[carId\]/page.tsx_

```diff
...

export const generateMetadata = async (props: Props): Promise<Metadata> => {
  const { params } = props;
  return {
    title: `Rent a car - Car ${params.carId} details`,
  };
};

+ export async function generateStaticParams() {
+   return [{ carId: '1' }, { carId: '2' }, { carId: '3' }];
+ }

...
```

Run again:

```bash
npm run start:api-server

npm run build

npm run start:prod
```

> Check `.next/server/app/cars/[carId]`.
>
> It will render the HTML for each car detail page.

We can fix the `page` title on `generateMetadata` using the api method `getCar` to fetch the car name:

_./app/cars/\[carId\]/page.tsx_

```diff
...

export const generateMetadata = async (props: Props): Promise<Metadata> => {
  const { params } = props;
+ const car = await getCar(params.carId);
  return {
-   title: `Rent a car - Car ${params.carId} details`,
+   title: `Rent a car - Car ${car.name} details`,
  };
};

...
```

> It will fetch the car details data only once.
>
> [Automatic fetch request deduping](https://nextjs.org/docs/app/building-your-application/data-fetching#automatic-fetch-request-deduping)

Run again:

```bash
npm run start:api-server
npm run build
npm run start:prod
```

What's if `api-server` has new data, let's use [Incremental Static Regeneration or Revalidating Data](https://nextjs.org/docs/app/building-your-application/data-fetching/revalidating):

_./app/cars/\_api/car-list.api.ts_

```diff
import { envConstants } from '@/_core/constants';
import { Car } from './car-list.api-model';

const url = `${envConstants.BASE_API_URL}/cars`;

- export const getCarList = async (): Promise<Car[]> => {
+ export const getCarList = async (options?: RequestInit): Promise<Car[]> => {
-   return await fetch(url).then((response) => response.json());
+   return await fetch(url, options).then((response) => response.json());
  };

```

_./app/cars/page.tsx_

```diff
import React from 'react';
import { Metadata } from 'next';
import { getCarList } from './_api';
import { CarList } from './_components';
import { mapCarListFromApiToVm } from './car-list.mappers';

export const metadata: Metadata = {
  title: 'Rent a car - Car list',
};

const CarListPage = async () => {
- const carList = await getCarList();
+ // cache: 'force-cache' is the default
+ const carList = await getCarList({ next: { revalidate: 10 } }); // In seconds
  console.log('Car list at build time:', { carList });

  return <CarList carList={mapCarListFromApiToVm(carList)} />;
};

export default CarListPage;

```

> It also have [on-demand revalidation](https://nextjs.org/docs/app/building-your-application/data-fetching/revalidating#using-on-demand-revalidation)

Run again:

```bash
npm run start:api-server
npm run build
npm run start:prod
```

Open browser at `http://localhost:8080/cars` and then add a new car:

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

While we navigate to car details:(`/cars/1`, `/cars/2`,...`/cars/4`) it doesn't update the car list.

If we refresh the `/cars` page again (F5) it pre-renders the `car page again` and show the new version (navigate to details and back again).

> It will works with Car Details too.

Remove data:

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

For fix `images` on car details, we nee to add a `domain` to 'optimize images with `next/image` hosted in external service:

_./.env.local_

```diff
BASE_API_URL=http://localhost:3001/api
BASE_PICTURES_URL=http://localhost:3001
+ IMAGES_DOMAIN=localhost

```

_./next.config.js_

```javascript
module.exports = {
  images: {
    domains: [process.env.IMAGES_DOMAIN],
  },
};
```

> [Remote Images](https://nextjs.org/docs/app/building-your-application/optimizing/images#remote-images)
>
> [Next config file](https://nextjs.org/docs/app/api-reference/next-config-js)

Run app dev mode:

```bash
npm run start:api-server
npm run build
npm run start:prod
```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
