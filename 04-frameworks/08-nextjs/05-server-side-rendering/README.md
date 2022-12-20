# 05 Server side rendering

Let's works with Nextjs using server side rendering.

We will start from `04-static-site-generation`.

# Steps to build it

- `npm install` to install previous sample packages:

```bash
npm install
```

# Server Side Rendering

If we can't pre-render a page ahead of a user's request but we need SEO. For example: search bar, shopping cart.

- The page is generated on each request.
- Only available on page components.
- [When to use it](https://nextjs.org/docs/basic-features/data-fetching#when-should-i-use-getserversideprops)

- Let's migrate `car list` page to SSR:

_./src/pages/cars.tsx_

```diff
import React from 'react';
- import { GetStaticProps } from 'next';
+ import { GetServerSideProps } from 'next';
...

- export const getStaticProps: GetStaticProps = async () => {
+ export const getServerSideProps: GetServerSideProps = async () => {
  const carList = await api.getCarList();
  console.log('Car list build time:', { carList });

  return {
    props: {
      carList,
    },
-   // Next.js will attempt to re-generate the page:
-   // - When a request comes in
-   // - At most once every second
-   revalidate: 10, // In seconds
  };
};

export default CarListPage;

```

- Run:

```bash
npm run start:api-server
npm run build
npm run start:prod
```

> Check `.next` folder, it doesn't have `cars.json` file
>
> Checks that first time it renders the page on `server side` but after navigate and come back it renders on `client side`.
>
> But every request fetch data (`cars.json`)
>
> Check navigation from index to `/cars`

- We can migrate use it on `car details` too:

_./src/pages/cars/[carId].tsx_

```diff
import React from 'react';
- import { GetStaticProps, GetStaticPaths } from 'next';
+ import { GetServerSideProps } from 'next';
...


const CarPage: React.FunctionComponent<Props> = (props) => {
  const { car } = props;
+ console.log(`Render car details page: ${car?.id}`);
  return (
...

- export const getStaticProps: GetStaticProps = async (context) => {
+ export const getServerSideProps: GetServerSideProps = async (context) => {
  const carId = context.params.carId as string;
  const car = await api.getCar(carId);
...

- export const getStaticPaths: GetStaticPaths = async () => {
-   return {
-     paths: [
-       { params: { carId: '1' } },
-       { params: { carId: '2' } },
-       { params: { carId: '3' } },
-     ],
-     fallback: true,
-   };
- };

export default CarPage;

```

- Run:

```bash
npm run start:api-server
npm run build
npm run start:prod
```

> Check first load
> Check navigation

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
