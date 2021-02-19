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

- 

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
