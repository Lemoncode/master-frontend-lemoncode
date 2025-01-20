import express from 'express';
import cookieParser from 'cookie-parser';

export const createRestApiServer = () => {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());

  return app;
};
