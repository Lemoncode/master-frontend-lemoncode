# 02 GraphQL Frontend

In this example we are going to add a basic setup needed to support GraphQL in frontend.

We will start from `01-graphql-backend`.

Summary steps:

- Install `graphql-request`.
- Add configuration.
- Update queries.

# Steps to build it

- `npm install` to install previous sample packages:

```bash
npm install
```

# Libraries

- We are going to install a library to work with graphql in front side, [graphql-request](https://github.com/prisma-labs/graphql-request). Make sure you are over `root` folder in terminal

```bash
npm install graphql-request graphql --save
```

> It has `graphql` lib as peerDependency.
> Install this library on frontend package.json

# Other libraries

- [relay](https://github.com/facebook/relay)
- [apollo-client](https://github.com/apollographql/apollo-client)
- [axios](https://github.com/axios/axios): We could create grapqhl queries using axios too.

# Config

- `graphql-request` has TypeScript support and we don't need an extra package:

- Add `webpack proxy` config to avoid configure `cors`:

### ./config/webpack/dev.js

```diff
...
  devServer: {
    inline: true,
    host: 'localhost',
    port: 8080,
    stats: 'minimal',
    hot: true,
    proxy: {
      '/api': 'http://localhost:3000',
+     '/graphql': 'http://localhost:3000',
    },
  },
```

- Create `GraphQL client` for use same url in all queries:

### ./core/api/graphql.client.ts

```javascript
import { GraphQLClient } from 'graphql-request';

const url = '/graphql';

export const graphQLClient = new GraphQLClient(url);

```

- Add barrel file:

### ./core/api/index.ts

```javascript
export * from './graphql.client';

```

- Update `hotel-collection` api:

### ./src/pods/hotel-collection/api/hotel-collection.api.ts

```diff
import Axios from 'axios';
+ import { gql } from 'graphql-request';
+ import { graphQLClient } from 'core/api';
import { HotelEntityApi } from './hotel-collection.api-model';

const url = '/api/hotels';

+ interface GetHotelCollectionResponse {
+   hotels: HotelEntityApi[];
+ }

export const getHotelCollection = async (): Promise<HotelEntityApi[]> => {
+ const query = gql`
+   query {
+     hotels {
+       id
+       name
+       shortDescription
+       hotelRating
+       address1
+       thumbNailUrl
+     }
+   }
+ `;
- const { data } = await Axios.get<HotelEntityApi[]>(url);
- return data;
+ const { hotels } = await graphQLClient.request<GetHotelCollectionResponse>(
+   query
+ );
+ return hotels;
};

...

```

> Check `Chrome Network` content size. 11.7KB vs 3.5KB

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
