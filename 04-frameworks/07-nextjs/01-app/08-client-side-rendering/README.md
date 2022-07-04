# 07 Client side rendering

Let's works with Nextjs using client side rendering.

We will start from `06-server-side-rendering`.

# Steps to build it

- `npm install` to install previous sample packages:

```bash
npm install
```

# Server Side Rendering

If we don't need to pre-render the data and frequently updating data. 

- The page is generated on client side.
- Available on pages and internal components.
- You can use [SWR](https://swr.vercel.app/) (stale-while-revalidate) for handle cache

> SWR is a strategy to first return the data from cache (stale), then send the fetch request (revalidate), and finally come with the up-to-date data

- Let's implement the api method to book a car:

_./src/api/car.api.ts_

```diff
...

+ export const bookCar = async (car: Car): Promise<boolean> => {
+   await Axios.put(`${url}/${car.id}`, car);
+   return true;
+ };

```

- Create mapper from `Vm to Api`:

_./src/mappers/car.mappers.ts_

```diff
...

+ export const mapCarFromVmToApi = (car: viewModel.Car): apiModel.Car => ({
+   id: car.id,
+   name: car.name,
+   imageUrl: car.imageUrl.split(envConstants.BASE_PICTURES_URL)[1],
+   features: car.features,
+   isBooked: car.isBooked,
+ });
```

- And use it:

_./src/components/car.container.ts_

```diff
import React from 'react';
import { useRouter } from 'next/router';
import * as api from '../api';
import { routeConstants } from '../common/constants';
- import { mapCarFromApiToVm } from '../mappers';
+ import { mapCarFromApiToVm, mapCarFromVmToApi } from '../mappers';
...

  const handleBook = async () => {
+   try {
+     const apiCar = mapCarFromVmToApi({ ...car, isBooked: !car.isBooked });
+     await api.bookCar(apiCar);
-     // TODO: Book a car
      router.push(routeConstants.carList);
+   } catch (error) {
+     console.error({ error });
+   }
  };

...

```

- Run:

```bash
npm run start:api-server
npm run build
npm run start:prod
```

> NOTE: We can use this API Request from any component.

- Let's migrate `car list` request to client-side (demo purpose):

_./src/pages/cars.ts_

```diff
import React from 'react';
- import { GetServerSideProps } from 'next';
import Head from 'next/head';
import * as api from '../api';
import { AppLayout, CarListContainer } from '../components';

- interface Props {
-   carList: api.Car[];
- }

- const CarListPage: React.FunctionComponent<Props> = (props) => {
+ const CarListPage: React.FunctionComponent = () => {
- const { carList } = props;
+ const [carList, setCarList] = React.useState<api.Car[]>([]);

+ const onLoad = async () => {
+   const apiCarList = await api.getCarList();
+   setCarList(apiCarList);
+ };

+ React.useEffect(() => {
+   onLoad();
+ }, []);

- console.log('Render car list Page');
+ console.log(`Render car list: ${carList.length}`);
  return (
    <AppLayout>
      <Head>
        <title>Rent a car - Car list</title>
      </Head>
      <CarListContainer carList={carList} />
    </AppLayout>
  );
};

- export const getServerSideProps: GetServerSideProps = async () => {
-   const carList = await api.getCarList();
-   console.log('Car list build time:', { carList });

-   return {
-     props: {
-       carList,
-     },
-   };
- };

export default CarListPage;

```

- Run:

```bash
npm run start:api-server
npm run build
npm run start:prod
```

- Each time navigate to this page, fetch data and renders again the page. Let's try [SWR](https://swr.vercel.app/):

```bash
npm install swr --save
```

- Let's export cars url:

_./src/api/car.api.ts_

```diff
import Axios from 'axios';
import { envConstants } from '../common/constants';
import { Car } from './car.api-model';

- const url = `${envConstants.BASE_API_URL}/cars`;
+ export const url = `${envConstants.BASE_API_URL}/cars`;
...

```

_./src/pages/cars.ts_

```diff
import React from 'react';
+ import useSWR from 'swr';
import Head from 'next/head';
import * as api from '../api';
import { AppLayout, CarListContainer } from '../components';

const CarListPage: React.FunctionComponent = () => {
- const [carList, setCarList] = React.useState<api.Car[]>([]);

- const onLoad = async () => {
-   const apiCarList = await api.getCarList();
-   setCarList(apiCarList);
- };

- React.useEffect(() => {
-   onLoad();
- }, []);
+ const { data } = useSWR(api.url, api.getCarList);
+ const carList = data || [];

  console.log(`Render car list: ${carList.length}`);
...

```

- Run:

```bash
npm run start:api-server
npm run build
npm run start:prod
```

- Open two browser tabs in `http://localhost:8080/cars`


- Add new car:

_./api-server/mock-data/data.json_

```diff
...
+   {
+     "id": "10",
+     "name": "New car",
+     "imageUrl": "/vw-touran.png",
+     "features": [],
+     "isBooked": false
+   }
```

- Remove `new car` Open two windows to check [revalidate on focus demo](https://swr.vercel.app/docs/revalidation#revalidate-on-focus) and add `new car` again.

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
