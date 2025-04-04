import express from 'express';
import path from 'node:path';
import { hotelApi, cityApi } from './api/index.js';
import { createHandler } from 'graphql-http/lib/use/express';
import { schema } from './graphql/schema.js';
import { resolvers } from './graphql/resolvers.js';

const PORT = 3000;
const app = express();
app.use(express.json());

app.use('/', express.static(path.resolve(import.meta.dirname, '../public')));

app.use('/graphql', createHandler({ schema, rootValue: resolvers }));
app.use('/playground', async (req, res) => {
  res.sendFile(path.join(import.meta.dirname, './graphql/playground.html'));
});

app.use('/api/hotels', hotelApi);
app.use('/api/cities', cityApi);

app.listen(PORT, () => {
  console.log(`Server running http://localhost:${PORT}`);
  console.log(
    `GraphQL Playground running at http://localhost:${PORT}/playground`
  );
  console.log(`GraphQL Server ready at por http://localhost:${PORT}/graphql`);
});
