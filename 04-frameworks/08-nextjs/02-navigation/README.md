# 02 Navigation

Let's create a second page and add navigation between the first and the second one.

We will start from `01-config`.

# Steps to build it

`npm install` to install previous sample packages:

```bash
npm install
```

Since router will automatically add routes from app structure, let's add a second page:

_./app/cars/page.tsx_

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

Run app:

```bash
npm start
```

We have two ways of navigations in Nextjs. Using `link` component:

_./app/page.tsx_

```diff
import React from 'react';
+ import Link from 'next/link';

const RootPage = () => {
- return <h2>Hello from Nextjs</h2>;
+ return (
+   <>
+     <h2>Hello from Nextjs</h2>
+     <Link href="/cars">Navigate to car list</Link>
+   </>
+ );
};

export default RootPage;

```
> [Next link](https://nextjs.org/docs/app/api-reference/components/link)
>
> [Routing](https://nextjs.org/docs/app/building-your-application/routing)

Or programmatically:

_./app/cars/page.tsx_

```diff
+ 'use client';
import React from 'react';
+ import { useRouter } from 'next/navigation';

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

> [useRouter](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#userouter-hook): It will do a `client-side` navigation between routes. 
>
> Also, since we are using a button with `onClick` event, we must add `'use client'` directive to mark it as a client component.

A common route to define on real apps are route with params like `cars/:carId`:

_./app/cars/\[carId\]/page.tsx_

```javascript
import React from 'react';

interface Props {
  params: { carId: string };
}

const CarPage = (props: Props) => {
  const { params } = props;
  return (
    <>
      <h2>Car detail page</h2>
      <p>{params.carId}</p>
    </>
  );
};

export default CarPage;

```

> [Dynamic routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
>
> [i18n-routing](https://nextjs.org/docs/app/building-your-application/routing/internationalization)

Open `http://localhost:3000/cars/audi`;

Title tags are a very important part for SEO purposes, thats why we can [modifying head](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#modifying-head) to update html's head on each page:

_./app/page.tsx_

```diff
import React from 'react';
import Link from 'next/link';
+ import { Metadata } from 'next';

+ export const metadata: Metadata = {
+   title: 'Rent a car - Home',
+ };

const HomePage = () => {
  return (
    <>
      <h2>Hello from Nextjs</h2>
...

```

_./app/cars/layout.tsx_

```jsx
import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rent a car - Car list',
};

interface Props {
  children: React.ReactNode;
}

const CarsLayout = (props: Props) => {
  const { children } = props;
  return children;
};

export default CarsLayout;

```

> We only can use `Metadata` on `server components`.
>
> Layouts will be reutilized on nested routes.

Open `http://localhost:3000/cars/audi` without modifying title tag.

Update it:

_./app/cars/\[carId\]/page.tsx_

```diff
import React from 'react';
+ import { Metadata } from 'next';

interface Props {
  params: { carId: string };
}

+ export const generateMetadata = async (props: Props): Promise<Metadata> => {
+   const { params } = props;
+   return {
+     title: `Rent a car - Car ${params.carId} details`,
+   };
+ };

const CarPage = (props: Props) => {
...

```

> Open `http://localhost:3000/cars/audi` again.

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
