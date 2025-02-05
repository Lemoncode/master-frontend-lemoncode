import express from 'express';
import path from 'node:path';
import { hotelApi, cityApi } from './api/index.js';
import { createGraphqlServer } from '#core/servers/index.js';
import { typeDefs } from '#core/graphql/type-def.js';
import { resolvers } from '#core/graphql/resolvers.js';

const PORT = 3000;
const app = express();
app.use(express.json());

app.use('/', express.static(path.resolve(import.meta.dirname, '../public')));

createGraphqlServer(app, { schema: typeDefs, rootValue: resolvers });

app.use('/api/hotels', hotelApi);
app.use('/api/cities', cityApi);

app.listen(PORT, () => {
  console.log(`Server running http://localhost:${PORT}`);
  console.log(`GraphQL Server ready at port http://localhost:${PORT}/graphql`);
});
