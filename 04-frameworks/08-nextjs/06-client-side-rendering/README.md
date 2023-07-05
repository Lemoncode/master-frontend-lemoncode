# 06 Client side rendering

Let's works with Nextjs using client side rendering.

We will start from `05-server-side-rendering`.

# Steps to build it

`npm install` to install previous sample packages:

```bash
npm install
```

# Client Side Rendering

If we don't need to pre-render the data and frequently updating data.

- Enalbe you to add client-side interactivity.
- Need to use `'use client'` directive.
- You cannot use Server Components inside a client-side component but you can use Server Components as children of a client-side component.
- [More info about Client Components](https://nextjs.org/docs/getting-started/react-essentials#client-components)

Let's look up the api method to book a car:

_./app/cars/\[carId\]/\_api/car.api.ts_

```javascript
...

export const bookCar = async (car: Car): Promise<boolean> => {
  await fetch(`${url}/${car.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(car),
  });
  return true;
};

```

And how are we using it:

_./app/cars/\[carId\]/\_components/car.component.tsx_

```javascript
'use client';
import React from 'react';
...

const handleBook = async () => {
    try {
      const apiCar = mapCarFromVmToApi({ ...car, isBooked: !car.isBooked });
      await api.bookCar(apiCar);
      router.push(routeConstants.carList);
    } catch (error) {
      console.error({ error });
    }
  };
...

```

Run:

```bash
npm run start:api-server
npm run build
npm run start:prod
```

> Check 404 on request `http://localhost:8080/cars/undefined/cars/1`
>
> The `image url` is working because we are using the `mapper` in a Server Component.

Why it doesn't work? Because we are using `use client` directive and the environment variable is only available on server side:

_./.env.local_

```diff
IMAGES_DOMAIN=localhost
- BASE_API_URL=http://localhost:3001/api
+ NEXT_PUBLIC_BASE_API_URL=http://localhost:3001/api
BASE_PICTURES_URL=http://localhost:3001

```

_./app/\_core/constants/env.constants.ts_

```diff
export const envConstants = {
- BASE_API_URL: process.env.BASE_API_URL,
+ BASE_API_URL: process.env.NEXT_PUBLIC_BASE_API_URL,
  BASE_PICTURES_URL: process.env.BASE_PICTURES_URL,
};

```

Run again:

```bash
npm run start:api-server
npm run build
npm run start:prod
```

But we have another problem, the car list is not updated after booking a car, we need to refresh the page to see the changes. Let's use [router.refresh](https://nextjs.org/docs/app/api-reference/functions/use-router#userouter):


_./app/cars/\[carId\]/\_components/car.component.tsx_

```diff
...

  const handleBook = async () => {
    try {
      const apiCar = mapCarFromVmToApi({ ...car, isBooked: !car.isBooked });
      await api.bookCar(apiCar);
+     router.refresh();
      router.push(routeConstants.carList);
    } catch (error) {
      console.error({ error });
    }
  };

...

```

Run again:

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
