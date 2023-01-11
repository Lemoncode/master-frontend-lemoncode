# 06 Client side rendering

Let's works with Nextjs using client side rendering.

We will start from `05-server-side-rendering`.

# Steps to build it

- `npm install` to install previous sample packages:

```bash
npm install
```

# Client Side Rendering

If we don't need to pre-render the data and frequently updating data.

- The page is generated on client side.
- Available on pages and internal components.
- You can use [SWR](https://swr.vercel.app/) (stale-while-revalidate) or [React query](https://tanstack.com/query/latest) for handle cache

> SWR is a strategy to first return the data from cache (stale), then send the fetch request (revalidate), and finally come with the up-to-date data

- Let's look up the api method to book a car:

_./src/pods/car/api/car.api.ts_

```javascript
...

export const bookCar = async (car: Car): Promise<boolean> => {
  await Axios.put(`${url}/${car.id}`, car);
  return true;
};

```

And how are we using it:

_./src/pods/car/car.container.tsx_

```javascript
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

- Run:

```bash
npm run start:api-server
npm run build
npm run start:prod
```

> NOTE: We can use this API Request from any component.

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
