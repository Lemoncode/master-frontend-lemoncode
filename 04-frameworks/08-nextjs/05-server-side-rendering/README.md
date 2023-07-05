# 05 Server side rendering

Let's works with Nextjs using server side rendering.

We will start from `04-static-site-generation`.

# Steps to build it

`npm install` to install previous sample packages:

```bash
npm install
```

# Server Side Rendering

If we can't pre-render a page ahead of a user's request but we need SEO. For example: search bar, shopping cart.

- The page is generated on each request.
- Only available on Server Components.
- [More about dynamic data fetching](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching#dynamic-data-fetching)

Let's migrate `car list` page to SSR:

_./app/cars/page.tsx_

```diff
...
const CarListPage = async () => {
  // cache: 'force-cache' is the default
- const carList = await getCarList({ next: { revalidate: 10 } }); // In seconds
+ const carList = await getCarList({ cache: 'no-store' });
  console.log('Car list at build time:', { carList });

  return <CarList carList={mapCarListFromApiToVm(carList)} />;
};

export default CarListPage;

```

- Run:

```bash
npm run start:api-server
npm run build
npm run start:prod
```

> Check `.next` folder, it doesn't have `cars.html` file
>
> Checks that first time it renders the page on `server side` but after navigate and come back it will never renders again (because it's a server component).
>
> Press F5 and check that it renders again.

We can migrate use it on `car details` too:

_./app/cars/\[carId\]/page.tsx_

```diff
...

- export async function generateStaticParams() {
-   return [{ carId: '1' }, { carId: '2' }, { carId: '3' }];
- }

const CarPage = async (props: Props) => {
...
```

Run:

```bash
npm run start:api-server
npm run build
npm run start:prod
```

> Check first load
>
> Check navigation

We could add `options` property in the API method:

_./app/cars/\[carId\]/\_api/car.api.ts_

```diff
import { envConstants } from '@/_core/constants';
import { Car } from './car.api-model';

const url = `${envConstants.BASE_API_URL}/cars`;

export const getCar = async (
  id: string,
+ options?: RequestInit
): Promise<Car> => {
- return await fetch(`${url}/${id}`).then((response) =>
+ return await fetch(`${url}/${id}`, options).then((response) =>
    response.json()
  );
};

...

```


_./app/cars/\[carId\]/page.tsx_

```diff
import React from 'react';
import { Metadata } from 'next';
import { getCar } from './_api';
import { Car } from './_components';
import { mapCarFromApiToVm } from './car.mappers';

interface Props {
  params: { carId: string };
}

export const generateMetadata = async (props: Props): Promise<Metadata> => {
  const { params } = props;
- const car = await getCar(params.carId); // Check 'force-cache' too
+ const car = await getCar(params.carId, { cache: 'no-store' });
  return {
    title: `Rent a car - Car ${car.name} details`,
  };
};

const CarPage = async (props: Props) => {
  const { params } = props;
- const car = await getCar(params.carId); // Check 'force-cache' too
+ const car = await getCar(params.carId, { cache: 'no-store' });
  console.log('Car page', car);

  return <Car car={mapCarFromApiToVm(car)} />;
};

export default CarPage;

```

> `cache: 'force-cache'`  and empty cache: will fetch data only once but it will re-render the component on each refresh (F5).

>`cache: 'no-store'`: will fetch data and re-render the component on each refresh (F5).

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
