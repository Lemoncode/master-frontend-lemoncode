import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

export const createRestApiServer = () => {
  const app = express();
  app.use(express.json());
  app.use(
    cors({
      credentials: true,
      origin: 'http://localhost:8080',
    })
  );
  app.use(cookieParser());

  return app;
};
