# 02 GraphQL Frontend

In this example we are going to add a basic setup needed to support GraphQL in frontend.

We will start from `01-graphql-backend`.

Summary steps:

- Configure the GraphQL endpoint.
- Implement requests using fetch.
- Update queries.

# Steps to build it

Run the following command to install dependencies from the previous sample:

```bash
npm install
```

# Libraries

Typically, we can use libraries like [graffle](https://github.com/graffle-js/graffle) or [Apollo Client](https://www.npmjs.com/package/@apollo/client) to interact with a GraphQL API. For example:

```bash
npm install graffle@next graphql --save
```

However, in this case, we will not use any external libraries and will handle GraphQL requests manually using the native fetch API.

Example request using fetch:

```javascript
const query = `
  query {
    users {
      id
      name
      email
    }
  }
`;

fetch('https://your-graphql-endpoint.com/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ query }),
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error('Error:', error));
```

This approach gives us full control over the requests without relying on third-party dependencies.

# Other libraries

- [relay](https://github.com/facebook/relay)
- [axios](https://github.com/axios/axios): We could create grapqhl queries using axios too.

# Config

- Add `vite proxy` config to avoid configure `cors`:

### ./vite.config.js

```diff
 import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
      '/thumbnails': 'http://localhost:3000',
+     '/graphql': 'http://localhost:3000',
    },
  },
});
```

- Create `GraphQL client` for use same url in all queries:

### ./core/api/graphql.client.ts

```javascript
const url = '/graphql';

interface GraphqlProps<Variables> {
  query: string;
  variables?: Variables;
}

export const graphql = async <Response, Variables = unknown>(
  props: GraphqlProps<Variables>
): Promise<Response> => {
  const { query, variables } = props;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });
  const { data, errors } = await response.json();

  if (errors) {
    console.error(errors);
  }

  return data;
};
```

The `graphql function` allows sending queries and retrieving data from the GraphQL server. It is responsible for:

- Sending the query to the server.
- Passing the required parameters or variables.
- Receiving the server response.
- Handling possible errors.

Currently, errors are simply logged to the console. However, in the future, we could implement a more robust error-handling mechanism, such as throwing exceptions, displaying user-friendly error messages, or integrating with an error-tracking system.

- Add barrel file:

### ./core/api/index.ts

```javascript
export * from './graphql.client';
```

- Update `hotel-collection` api:

### ./src/pods/hotel-collection/api/hotel-collection.api.ts

```diff
import axios from 'axios';
+ import { graphql } from '#core/api';
import { HotelEntityApi } from './hotel-collection.api-model';

const url = '/api/hotels';

+ interface GetHotelCollectionResponse {
+  hotels: HotelEntityApi[];
+ }

export const getHotelCollection = async (): Promise<HotelEntityApi[]> => {
-  const { data } = await axios.get<HotelEntityApi[]>(url);
-  return data;
+  const query = `
+    query {
+      hotels {
+        id
+        name
+        shortDescription
+        hotelRating
+        address1
+        thumbNailUrl
+      }
+    }
+  `;

+  const { hotels } = await graphql<GetHotelCollectionResponse>({
+    query,
+  });

+  return hotels;
};

...

```

> Check `Chrome Network` content size. 11.7KB vs 3.5KB

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
