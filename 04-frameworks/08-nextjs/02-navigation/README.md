# 02 Navigation

Let's create a second page and add navigation between the first and the second one.

We will start from `01-config`.

# Steps to build it

- `npm install` to install previous sample packages:

```bash
npm install
```

- Since router will automatically add routes from file name inside `pages` folder, let's add a second page:

_./src/pages/cars.tsx_

```javascript
import React from 'react';

const CarListPage = () => {
  return (
    <>
      <h2>Car list page</h2>
      <ul>
        <li>Audi Q8</li>
        <li>BMW X7</li>
      </ul>
    </>
  );
};

export default CarListPage;
```

- Run app:

```bash
npm start
```

- We have two ways of navigations in Nextjs. Using `link` component:

_./src/pages/index.tsx_

```diff
import React from 'react';
+ import Link from 'next/link';

const HomePage = () => {
- return <h2>Hello from Nextjs</h2>;
+ return (
+   <>
+     <h2>Hello from Nextjs</h2>
+     <Link href="/cars">Navigate to car list</Link>
+   </>
+ );
};

export default HomePage;

```
> [Next link](https://nextjs.org/docs/api-reference/next/link)
>
> [Routing](https://nextjs.org/docs/routing/introduction)

- Or programmatically:

_./src/pages/cars.tsx_

```diff
import React from 'react';
+ import { useRouter } from 'next/router';

const CarListPage = () => {
+ const router = useRouter();
+ const onNavigateBack = () => {
+   router.push('/'); // or router.back()
+ };

  return (
    <>
      <h2>Car list page</h2>
      <ul>
        <li>Audi Q8</li>
        <li>BMW X7</li>
      </ul>
+     <button onClick={onNavigateBack}>Navigate to home</button>
    </>
  );
};

export default CarListPage;

```

- A common route to define on real apps are route with params like `cars/:carId`:

_./src/pages/cars/\[carId\].tsx_

```javascript
import React from 'react';
import { useRouter } from 'next/router';

const CarPage = () => {
  const router = useRouter();
  return (
    <>
      <h2>Car detail page</h2>
      <p>{router.query.carId}</p>
    </>
  );
};

export default CarPage;
```

> [Dynamic routes](https://nextjs.org/docs/routing/dynamic-routes)
>
> [i18n-routing](https://nextjs.org/docs/advanced-features/i18n-routing)

- Check route `http://localhost:3000/cars/3`;

- Title tags are a very important part for SEO purposes, thats why we can use [next/head](https://nextjs.org/docs/api-reference/next/head) to update html's head on each page:

_./src/pages/index.tsx_

```diff
import React from 'react';
import Link from 'next/link';
+ import Head from 'next/head';

const HomePage = () => {
  return (
    <>
+     <Head>
+       <title>Rent a car - Home</title>
+     </Head>
      <h2>Hello from Nextjs</h2>
...

```

_./src/pages/cars.tsx_

```diff
import React from 'react';
import { useRouter } from 'next/router';
+ import Head from 'next/head';

const CarListPage = () => {
  ...

  return (
    <>
+     <Head>
+       <title>Rent a car - Car list</title>
+     </Head>
      <h2>Car list page</h2>
...

```

_./src/pages/cars/\[carId\].tsx_

```diff
import React from 'react';
import { useRouter } from 'next/router';
+ import Head from 'next/head';

const CarPage = () => {
  const router = useRouter();
  return (
    <>
+     <Head>
+       <title>Rent a car - Car {router.query.carId} details</title>
+     </Head>
      <h2>Car detail page</h2>
...

```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
