import path from 'node:path';
import { Express } from 'express';
import { createHandler, HandlerOptions } from 'graphql-http/lib/use/express';

export const createGraphqlServer = (
  expressApp: Express,
  options: HandlerOptions
) => {
  expressApp.use('/graphql', createHandler(options));
  expressApp.use('/playground', async (req, res) => {
    res.sendFile(path.join(import.meta.dirname, '../graphql/playground.html'));
  });
};
