import express from 'express';
import cors from 'cors';

export const createRestApiServer = () => {
  const app = express();
  app.use(express.json());
  app.use(
    cors({
      credentials: true,
      origin: '*',
    })
  );

  return app;
};
