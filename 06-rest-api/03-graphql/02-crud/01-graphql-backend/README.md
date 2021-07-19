# 01 GraphQL Backend

In this example we are going to add a basic setup needed to support GraphQL in backend.

We will start from `00-boilerplate`.

Summary steps:

- Install `apollo-server-express`.
- Add configuration.
- Add type-defs.
- Add resolvers.

# Steps to build it

- `npm install` to install previous sample packages:

```bash
npm install
```

# Libraries

- We are going to install the main library to work with graphql and express, [apollo-server-express](https://www.npmjs.com/package/apollo-server-express). ([Documentation page](https://www.apollographql.com/docs/apollo-server/))

```bash
cd ./server
npm install apollo-server-express graphql --save
```
> It has `graphql` lib as peerDependency.

# Config

- ApolloServer comes with types definitions and we don't need an extra package for TypeScript. We have to define a new `ApolloServer` instance to create a new `GraphQL Server`:

### ./server/src/index.ts

```diff
import 'regenerator-runtime/runtime';
import express from 'express';
import path from 'path';
+ import { ApolloServer } from 'apollo-server-express';
import { hotelApi, cityApi } from './api';

const PORT = 3000;
+ (async function () {
    const app = express();
    app.use(express.json());
+   const graphqlServer = new ApolloServer({});
+   await graphqlServer.start();
+   graphqlServer.applyMiddleware({ app });

    const publicPath = path.resolve(__dirname, './public');
    app.use(express.static(publicPath));
    app.use('/api/hotels', hotelApi);
    app.use('/api/cities', cityApi);

    app.listen(PORT, () => {
      console.log(`Server running http://localhost:${PORT}`);
+     console.log(
+       `GraphQL server ready at http://localhost:${PORT}${graphqlServer.graphqlPath}`
+     );
    });
+ })();

```

> Since v3 we have to use `graphqlServer.start` method. [Reference](https://github.com/apollographql/apollo-server/blob/main/CHANGELOG.md#changes-to-nodejs-framework-integrations)

- Let's create a dummy endpoint to test it:

### ./server/src/index.ts

```diff
...
- import { ApolloServer } from 'apollo-server-express';
+ import { ApolloServer, gql } from 'apollo-server-express';
import { hotelApi, cityApi } from './api';

+ const typeDefs = gql`
+   type Query {
+     hello: String!
+   }
+ `;

+ const resolvers = {
+   Query: {
+     hello: () => {
+       return 'Working endpoint!';
+     },
+   },
+ };

const PORT = 3000;
(async function () {
  const app = express();
  app.use(express.json());
- const graphqlServer = new ApolloServer({});
+ const graphqlServer = new ApolloServer({
+   typeDefs,
+   resolvers,
+ });
  await graphqlServer.start();
  graphqlServer.applyMiddleware({ app });
...

```

- Let's run it. Make sure you are over `server` folder in terminal:

```bash
npm start
```

> Open GraphQL server at [http://localhost:3000/graphql](http://localhost:3000/graphql)
>
> Check grapql tool, only available at development mode
>
> Check docs
>
> All queries are stored in localStorage.
>
> We could enable previous [GraphQL Playground](https://www.apollographql.com/docs/apollo-server/migration/#graphql-playground)

Example query:

```graphql
query {
  hello
}
```

- Enable `previous Playground`:

### ./server/src/index.ts

```diff
...
import { ApolloServer, gql } from 'apollo-server-express';
+ import {
+   ApolloServerPluginLandingPageGraphQLPlayground,
+   ApolloServerPluginLandingPageDisabled,
+ } from 'apollo-server-core';
import { hotelApi, cityApi } from './api';

...

const PORT = 3000;
(async function () {
  const app = express();
  app.use(express.json());
  const graphqlServer = new ApolloServer({
    typeDefs,
    resolvers,
+   plugins: [
+     process.env.NODE_ENV === 'production'
+       ? ApolloServerPluginLandingPageDisabled()
+       : ApolloServerPluginLandingPageGraphQLPlayground(),
+   ],
  });
  await graphqlServer.start();
 ...

```

- Now, we can start implementing `hotel` GraphQL Schema:

### ./server/src/graphql/type-defs.ts

```javascript
import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Hotel {
    id: ID!
    type: String!
    name: String!
    address1: String!
    city: String!
    hotelRating: Float!
    shortDescription: String!
    thumbNailUrl: String!
    tripAdvisorRating: Float!
    tripAdvisorRatingUrl: String!
  }

  type Query {
    hotels: [Hotel!]!
  }
`;
```
> Install [Apollo GraphQL VSCode extension](https://www.apollographql.com/docs/devtools/editor-plugins/).
> [Scalar Types](https://graphql.org/learn/schema/#scalar-types)

- Implementing resolvers:

### ./server/src/graphql/resolvers.ts

```javascript
import { getHotelList, Hotel } from '../db';

export const resolvers = {
  Query: {
    hotels: async (): Promise<Hotel[]> => {
      const hotels = await getHotelList();
      return hotels;
    },
  },
};

```

- Let's create `barrel` file:

### ./server/src/graphql/index.ts

```javascript
export * from './type-defs';
export * from './resolvers';

```

- And use it:

### ./server/src/index.ts

```diff
- import { ApolloServer, gql } from 'apollo-server-express';
+ import { ApolloServer } from 'apollo-server-express';
import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageDisabled,
} from 'apollo-server-core';
import { hotelApi } from './api';
+ import { typeDefs, resolvers } from './graphql';

- const typeDefs = gql`
-   type Query {
-     hello: String!
-   }
- `;

- const resolvers = {
-   Query: {
-     hello: () => {
-       return 'Working endpoint!';
-     },
-   },
- };

...
```

- Now, we can run it and check:

```bash
npm start
```

- Example query:

```graphql
query {
  hotels {
    id
    name
  }
}
```

> Check `Chrome Network tab`

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
