# 05 Static sites

Let's works with Nextjs using pages generated at build time.

We will start from `04-images`.

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
+   "start": "run-p -l start:dev start:api-server",
    "start:dev": "next dev",
    ...
  },
```

- Let's create the `api` to get car list:

_./src/api/car.api-model.ts_

```javascript
export interface Car {
  id: string;
  name: string;
  imageUrl: string;
  features: string[];
  isBooked: boolean;
}
```

_./src/api/car.api.ts_

```javascript
import Axios from 'axios';
import { Car } from './car.api-model';

const url = `http://localhost:3001/api/cars`;

export const getCarList = async (): Promise<Car[]> => {
  const { data } = await Axios.get<Car[]>(url);
  return data;
};

```

- Add barrel file:

_./src/api/index.ts_

```javascript
export * from './car.api';
export * from './car.api-model';
```

- We can create an `env variable`:

_./.env.local_

```
BASE_API_URL=http://localhost:3001/api

```

> [Env variables in Nextjs](https://nextjs.org/docs/basic-features/environment-variables#loading-environment-variables)

- Create constants:

_./src/common/constants/env.constants.ts_

```javascript
export const envConstants = {
  BASE_API_URL: process.env.BASE_API_URL,
};
```

- Add barrel file:

_./src/common/constants/index.ts_

```javascript
export * from './env.constants';
```

- And use it:

_./src/api/car.api.ts_

```diff
import Axios from 'axios';
+ import { envConstants } from '../common/constants';
import { Car } from './car.api-model';

- const url = `http://localhost:3001/api/cars`;
+ const url = `${envConstants.BASE_API_URL}/cars`;

...

```

- Now, we will use this method to load car list on build time:

_./src/pages/cars.tsx_

```diff
import React from 'react';
- import { useRouter } from 'next/router';
import Head from 'next/head';
import { AppLayout, CarListComponent } from '../components';

const CarListPage = () => {
- const router = useRouter();
- const onNavigateBack = () => {
-   router.push('/'); // or router.back()
- };

  return (
    <AppLayout>
      <Head>
        <title>Rent a car - Car list</title>
      </Head>
-     <h2>Car list page</h2>
      <CarListComponent />
-     <button onClick={onNavigateBack}>Navigate to home</button>
    </AppLayout>
  );
};

export default CarListPage;

```

> [getStaticProps](https://nextjs.org/docs/basic-features/data-fetching#getstaticprops-static-generation)

- Run in `two` terminals:

```bash
npm run start:api-server

npm run build
```

- Stop `api-server` and run:

```bash
npm run start:prod
```

- Let's try on dev mode:

```bash
npm run start:dev
```

> NOTE: First load http://localhost:3000/cars

- In dev mode it's working as `server side rendering`. How we can use breakpoints on `getStaticProps` method if it's executing on server side? We need add a VSCode debug config:

_./.vscode/launch.json_

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "attach",
      "name": "Debug",
      "skipFiles": ["<node_internals>/**"],
      "port": 9229
    }
  ]
}
```

> [Debugging docs](https://nextjs.org/docs/advanced-features/debugging)

- Add script command:

_./package.json_

```diff
  "scripts": {
    "start": "run-p -l start:dev start:api-server",
    "start:dev": "next dev",
+   "start:debug": "run-p -l debug start:api-server",
+   "debug": "cross-env NODE_OPTIONS='--inspect' next dev",
    ...
  },
```

- Run `start:debug` and VSCode debugger:

```bash
npm run start:debug
```

- Now, if we want to render this car list, we will need to create a mapper to aim `imageUrl` to `api-server` where this images are published:

_./src/view-models/car.vm.ts_

```javascript
export interface Car {
  id: string;
  name: string;
  imageUrl: string;
  features: string[];
  isBooked: boolean;
}
```

> NOTE: In this view, we need less fields.

- Add barrel file:

_./src/view-models/index.ts_

```javascript
export * from './car.vm';
```

- Add mapper:

_./src/mappers/car.mappers.ts_

```javascript
import { envConstants } from '../common/constants';
import * as apiModel from '../api';
import * as viewModel from '../view-models';

export const mapCarFromApiToVm = (car: apiModel.Car): viewModel.Car =>
  Boolean(car)
    ? {
        id: car.id,
        name: car.name,
        imageUrl: `${envConstants.BASE_PICTURES_URL}${car.imageUrl}`,
        features: car.features,
        isBooked: car.isBooked,
      }
    : {
        id: '',
        name: '',
        imageUrl: '',
        features: [],
        isBooked: false,
      };

export const mapCarListFromApiToVm = (
  carList: apiModel.Car[]
): viewModel.Car[] =>
  Array.isArray(carList) ? carList.map(mapCarFromApiToVm) : [];
```

- Add barrel file:

_./src/mappers/index.ts_

```javascript
export * from './car.mappers';
```

- Create `env`:

_./src/common/constants/env.constants.ts_

```diff
export const envConstants = {
  BASE_API_URL: process.env.BASE_API_URL,
+ BASE_PICTURES_URL: process.env.BASE_PICTURES_URL,
};

```

_./.env.local_

```diff
+ BASE_PICTURES_URL=http://localhost:3001
- BASE_API_URL=http://localhost:3001/api
+ BASE_API_URL=$BASE_PICTURES_URL/api

```

- Define `route` constants:

_./src/common/constants/route.constants.ts_

```javascript
export interface Routes {
  root: string;
  carList: string;
  car: (cardId: string) => string;
}

export const routeConstants: Routes = {
  root: '/',
  carList: '/cars',
  car: (cardId: string) => `/cars/${cardId}`,
};
```

- Update barrel:

_./src/common/constants/index.ts_

```diff
export * from './env.constants';
+ export * from './route.constants';

```

- Add the car item component and styles:

_./src/components/car-item.styles.ts_

```javascript
import { css } from '@emotion/css';
import { theme } from '../common/theme';

export const cardMedia = css`
  height: 0;
  padding-top: 56.25%;
`;

export const availableIcon = css`
  fill: ${theme.palette.success.main};
`;

export const bookedIcon = css`
  fill: ${theme.palette.error.main};
`;
```

_./src/components/car-item.component.tsx_

```javascript
import React from 'react';
import { useRouter } from 'next/router';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader/CardHeader';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import AvailableIcon from '@material-ui/icons/CheckCircle';
import BookedIcon from '@material-ui/icons/Cancel';
import { routeConstants } from '../common/constants';
import { Car } from '../view-models';
import * as classes from './car-item.styles';

interface Props {
  car: Car;
}

export const CarItem: React.FunctionComponent<Props> = (props) => {
  const { car } = props;
  const router = useRouter();

  return (
    <Card>
      <CardActionArea onClick={() => router.push(routeConstants.car(car.id))}>
        <CardHeader
          title={car.name}
          avatar={
            car.isBooked ? (
              <BookedIcon className={classes.bookedIcon} />
            ) : (
              <AvailableIcon className={classes.availableIcon} />
            )
          }
        />
        <CardContent>
          <CardMedia
            className={classes.cardMedia}
            image={car.imageUrl}
            title={car.name}
          />
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
```

- Add the car list component and styles:

_./src/components/car-list.styles.ts_

```diff
import { css } from '@emotion/css';
+ import { theme } from '../common/theme';

export const root = css`
- list-style: none;
- background-color: chocolate;
- color: white;
+ display: grid;
+ grid-template-columns: 1fr;
+ column-gap: 2rem;
+ row-gap: 2rem;
+ list-style: none;
+ margin: 0;
+ padding: 0;

+ @media (min-width: ${theme.breakpoints.values.sm}px) {
+   grid-template-columns: repeat(2, 1fr);
+ }

+ @media (min-width: ${theme.breakpoints.values.md}px) {
+   grid-template-columns: repeat(3, 1fr);
+ }
`;

```

_./src/components/car-list.component.tsx_

```diff
import React from 'react';
+ import { Car } from '../view-models';
+ import { CarItem } from './car-item.component';
import * as classes from './car-list.styles';

+ interface Props {
+   carList: Car[];
+ }

- export const CarListComponent: React.FunctionComponent = (props) => {
+ export const CarListComponent: React.FunctionComponent<Props> = (props) => {
+ const { carList } = props;
  return (
    <ul className={classes.root}>
-     <li>Audi Q8</li>
-     <li>BMW X7</li>
+     {carList.map((car) => (
+       <li key={car.id}>
+         <CarItem car={car} />
+       </li>
+     ))}
    </ul>
  );
};

```

- Create car list `container` where we can use some logic before render the component:

_./src/components/car-list.container.tsx_

```javascript
import React from 'react';
import * as api from '../api';
import { mapCarListFromApiToVm } from '../mappers';
import { CarListComponent } from './car-list.component';

interface Props {
  carList: api.Car[];
}

export const CarListContainer: React.FunctionComponent<Props> = (props) => {
  const carList = mapCarListFromApiToVm(props.carList);

  return <CarListComponent carList={carList} />;
};
```

- Update barrel:

_./src/components/index.ts_

```diff
- export * from './car-list.component';
+ export * from './car-list.container';
export * from './app.layout';

```

- And use in page:

_./src/pages/car.tsx_

```diff
import React from 'react';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import * as api from '../api';
- import { AppLayout, CarListComponent } from '../components';
+ import { AppLayout, CarListContainer } from '../components';
...
const CarListPage: React.FunctionComponent<Props> = (props) => {
  const { carList } = props;
- console.log(`Car list on component: `, { carList });
  return (
    <AppLayout>
      <Head>
        <title>Rent a car - Car list</title>
      </Head>
-     <CarListComponent />
+     <CarListContainer carList={carList} />
    </AppLayout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const carList = await api.getCarList();
- console.log(`Car list build time: `, { carList });
...
```

- Stop app and run again:

```bash
npm run start:debug
```

- It looks great, but if we navigate to some car details and the go back, the images will disappears. It's because Nextjs delegate to client render after the first load.

> NOTE: Same behaviour on prod mode (build + start:prod)

- The issue is that `envConstants.BASE_PICTURES_URL` is `undefined` on client site. It means that current `env variables` are availables only for backend. If we want to expose some variables to client side too:

_./.env.local_

```diff
- BASE_PICTURES_URL=http://localhost:3001
- BASE_API_URL=$BASE_PICTURES_URL/api
+ NEXT_PUBLIC_BASE_PICTURES_URL=http://localhost:3001
+ NEXT_PUBLIC_BASE_API_URL=$NEXT_PUBLIC_BASE_PICTURES_URL/api

```

> Prefix `NEXT_PUBLIC_` > [Client side env](https://nextjs.org/docs/basic-features/environment-variables#exposing-environment-variables-to-the-browser)
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
npm run start:debug
```

## GetStaticPaths

- If we need to define a list of pages to get availables at build time (like each `car details`), we can use `getStaticPaths`.

- Let's add the component and styles:

_./src/components/car.styles.ts_

```javascript
import { css } from '@emotion/css';
import { theme } from '../common/theme';

export const root = css`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr auto auto;
  grid-template-areas:
    'name'
    'image'
    'features'
    'book';
  column-gap: 2rem;
  row-gap: 2rem;
  align-items: center;

  @media (min-width: ${theme.breakpoints.values.md}px) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-areas:
      'name .'
      'image features'
      'book book';
  }
`;

export const name = css`
  grid-area: name;
  justify-self: center;
  @media (min-width: ${theme.breakpoints.values.md}px) {
    justify-self: stretch;
  }
`;

export const book = css`
  grid-area: book;
  align-self: center;
  justify-self: center;
`;

export const image = css`
  grid-area: image;
  position: relative;
  justify-self: stretch;
  align-self: stretch;
`;

export const features = css`
  grid-area: features;
  list-style: none;
`;
```

_./src/components/car.component.tsx_

```javascript
import React from 'react';
import Image from 'next/image';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Car } from '../view-models';
import * as classes from './car.styles';

interface Props {
  car: Car;
  onBook: () => void;
}

export const CarComponent: React.FunctionComponent<Props> = (props) => {
  const { car, onBook } = props;

  return (
    <div className={classes.root}>
      <Typography className={classes.name} variant="h3">
        {car.name}
      </Typography>
      <div className={classes.image}>
        <Image
          src={car.imageUrl}
          layout="responsive"
          width={350}
          height={200}
        />
      </div>
      <ul className={classes.features}>
        {car.features.map((feature) => (
          <li key={feature}>
            <Typography variant="h6">{feature}</Typography>
          </li>
        ))}
      </ul>
      <Button
        className={classes.book}
        variant="contained"
        color={car.isBooked ? 'secondary' : 'primary'}
        onClick={onBook}
      >
        {car.isBooked ? 'Descartar reserva' : 'Reservar'}
      </Button>
    </div>
  );
};
```

- Add `container`:

_./src/components/car.container.tsx_

```javascript
import React from 'react';
import { useRouter } from 'next/router';
import * as api from '../api';
import { routeConstants } from '../common/constants';
import { mapCarFromApiToVm } from '../mappers';
import { CarComponent } from './car.component';

interface Props {
  car: api.Car;
}

export const CarContainer: React.FunctionComponent<Props> = (props) => {
  const router = useRouter();
  const car = mapCarFromApiToVm(props.car);
  const handleBook = async () => {
    // TODO: Book a car
    router.push(routeConstants.carList);
  };

  return <CarComponent car={car} onBook={handleBook} />;
};
```

- Update barrel:

_./src/components/index.ts_

```diff
export * from './car-list.container';
export * from './app.layout';
+ export * from './car.container';

```

- Update car `page`:

_./src/pages/cars/\[carId\].tsx_

```diff
import React from 'react';
- import { useRouter } from 'next/router';
import Head from 'next/head';
+ import * as api from '../../api';
+ import { AppLayout, CarContainer } from '../../components';

+ interface Props {
+   car: api.Car;
+ }

- const CarPage = () => {
+ const CarPage: React.FunctionComponent<Props> = (props) => {
- const router = useRouter();
+ const { car } = props;
  return (
-   <>
+   <AppLayout>
      <Head>
-       <title>Rent a car - Car {router.query.carId} details</title>
+       <title>Rent a car - Car {car?.name} details</title>
      </Head>
-     <h2>Car detail page</h2>
-     <p>{router.query.carId}</p>
+     <CarContainer car={car} />
-   </>
+   </AppLayout>
  );
};

export default CarPage;

```

- Let's create the api to get car details:

_./src/api/car.api.ts_

```diff
...

+ export const getCar = async (id: string): Promise<Car[]> => {
+   const { data } = await Axios.get<Car[]>(`${url}/${id}`);
+   return data;
+ };

```

- Let's update the page:

_./src/pages/cars/\[carId\].tsx_

```diff
import React from 'react';
+ import { GetStaticProps } from 'next';
import Head from 'next/head';
...

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

> NOTE: We can use something like:
>
> ```javascript
> export const getStaticPaths: GetStaticPaths = async () => {
>   const carList = await api.getCarList();
>   const paths = carList.map((c) => ({ params: { carId: c.id } }));
>   return {
>     paths,
>     fallback: true,
>   };
> };
> ```

- What's if `api-server` has new data, let's use [Incremental Static Regeneration](https://nextjs.org/docs/basic-features/data-fetching#incremental-static-regeneration):

_./src/pages/cars.tsx_

```diff
...

export const getStaticProps: GetStaticProps = async () => {
  const carList = await api.getCarList();
+ console.log(`Render car list: ${carList.length}`);

  return {
    props: {
      carList,
    },
+   // Next.js will attempt to re-generate the page:
+   // - When a request comes in
+   // - At most once every second
+   revalidate: 1, // In seconds
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
+     "imageUrl": "/vw-touran.png",
+     "features": [],
+     "isBooked": false
+   }
```

- While we navigate to car details:(`/cars/1`, `/cars/2`,...`/cars/4`) it doesn't update the car list.

- If we refresh the `/cars` page again (F5) it pre-renders the `car page again` and show the new version (navigate to details and back again).

> It will works with Car Details too.
> Check ` revalidate: 10` and press F5 many times

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
+ NEXT_PUBLIC_BASE_PICTURES_URL=http://$DOMAIN:3001
NEXT_PUBLIC_BASE_API_URL=$NEXT_PUBLIC_BASE_PICTURES_URL/api

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
