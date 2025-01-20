import express from 'express';

export const createRestApiServer = () => {
  const app = express();
  app.use(express.json());

  return app;
};
