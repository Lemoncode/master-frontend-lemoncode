# 01 GraphQL Backend

In this example we are going to add a basic setup needed to support GraphQL in backend.

We will start from `00-boilerplate`.

Summary steps:

- Install `graphql` and `graphql-http`.
- Add configuration.
- Add type-defs.
- Add resolvers.

# Steps to build it

- `npm install` to install previous sample packages:

```bash
npm install
```

# Libraries

We are going to install the main library to work with graphql and express, [graphql-http](https://github.com/graphql/graphql-http).

> [Documentation page](https://graphql.org/learn/)
>
> [grapqhl package docs](https://graphql.org/graphql-js/)

```bash
npm install graphql-http graphql  --save

```

> It has `graphql` lib as dependency.
>
> [Playground](https://github.com/graphql/graphql-playground/tree/main)

# Add Playground

_./server/src/graphql/playground.html_

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>GraphiQL</title>
    <style>
      body {
        height: 100%;
        margin: 0;
        width: 100%;
        overflow: hidden;
      }

      #graphiql {
        height: 100vh;
      }
    </style>
    <script
      crossorigin
      src="https://unpkg.com/react@18/umd/react.production.min.js"
    ></script>
    <script
      crossorigin
      src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"
    ></script>
    <script
      src="https://unpkg.com/graphiql/graphiql.min.js"
      type="application/javascript"
    ></script>
    <link rel="stylesheet" href="https://unpkg.com/graphiql/graphiql.min.css" />
    <script
      src="https://unpkg.com/@graphiql/plugin-explorer/dist/index.umd.js"
      crossorigin
    ></script>

    <link
      rel="stylesheet"
      href="https://unpkg.com/@graphiql/plugin-explorer/dist/style.css"
    />
  </head>

  <body>
    <div id="graphiql">Loading...</div>
    <script>
      const root = ReactDOM.createRoot(document.getElementById('graphiql'));
      const fetcher = GraphiQL.createFetcher({
        url: '/graphql',
      });
      const explorerPlugin = GraphiQLPluginExplorer.explorerPlugin();
      root.render(
        React.createElement(GraphiQL, {
          fetcher,
          defaultEditorToolsVisibility: true,
          plugins: [explorerPlugin],
        })
      );
    </script>
  </body>
</html>
```

The fetcher is set to point to the /graphql endpoint, which is where GraphiQL will send requests to
interact with the GraphQL server. To work correctly, the backend must expose a GraphQL API at /graphql,
matching this path.

# Config

- graphql-http comes with types definitions and we don't need an extra package for TypeScript. We have to define a new `graphql-http` instance to create a new `GraphQL Server` and let's create a dummy endpoint to test it:

### ./server/src/index.ts

```diff
import 'regenerator-runtime/runtime';
import express from 'express';
import path from 'path';
import { hotelApi, cityApi } from './api';
+ import { createHandler } from 'graphql-http/lib/use/express';
+ import { buildSchema } from 'graphql';

const PORT = 3000;
const app = express();
app.use(express.json());

app.use('/', express.static(path.resolve(import.meta.dirname, '../public')));

+ const schema = buildSchema(`
+   type Query {
+     hello: String
+   }
+ `);
+ const resolvers = {
+   hello: () => {
+     return 'Working endpoint!';
+   },
+ };
+ app.use('/graphql', createHandler({ schema, rootValue: resolvers }));
+ app.use('/playground', async (req, res) => {
+   res.sendFile(
+     path.join(import.meta.dirname, './core/graphql/playground.html')
+   );
+ });

  app.use('/api/hotels', hotelApi);
  app.use('/api/cities', cityApi);

  app.listen(PORT, () => {
    console.log(`Server running http://localhost:${PORT}`);
+     console.log(
+    `GraphQL Playground running at http://localhost:${PORT}/playground`
+  );
+  console.log(`GraphQL Server ready at por http://localhost:${PORT}/graphql`);
});
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

Example query:

```graphql
query {
  hello
}
```

- Now, we can start implementing `hotel` GraphQL Schema:

### ./server/src/graphql/schema.ts

```javascript
import { buildSchema as graphql } from 'graphql';

export const schema = graphql(`
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
`);
```

- Implementing resolvers:

### ./server/src/graphql/resolvers.ts

```javascript
import { getHotelList } from '#db/index.js';
import { Hotel } from '#db/models/index.js';

export const resolvers = {
  hotels: async (): Promise<Hotel[]> => {
    const hotels = await getHotelList();
    return hotels;
  },
};
```

- And use them:

### ./server/src/index.ts

```diff
import express from 'express';
import path from 'node:path';
import { hotelApi, cityApi } from './api/index.js';
import { createGraphqlServer } from '#core/servers/index.js';
- import { buildSchema } from 'graphql';
+ import { schema } from './graphql/schema.js';
+ import { resolvers } from './graphql/resolvers.js';

const PORT = 3000;
const app = express();
app.use(express.json());

app.use('/', express.static(path.resolve(import.meta.dirname, '../public')));

- const schema = buildSchema(`
-   type Query {
-     hello: String
-   }
- `);
- const resolvers = {
-   hello: () => {
-     return 'Working endpoint!';
-   },
- };
app.use('/graphql', createHandler({ schema, rootValue: resolvers }));
app.use('/playground', async (req, res) => {
  res.sendFile(
    path.join(import.meta.dirname, './core/graphql/playground.html')
  );
});

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
