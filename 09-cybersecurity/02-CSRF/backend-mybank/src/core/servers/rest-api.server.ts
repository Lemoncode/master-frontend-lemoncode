import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';
import { envConstants } from "../constants";

export const createRestApiServer = () => {
  const restApiServer = express();
  restApiServer.use(express.json());
  restApiServer.use(
    cors({
      methods: envConstants.CORS_METHODS,
      origin: envConstants.CORS_ORIGIN,
      credentials: true,
    })
  );
  restApiServer.use(cookieParser());

  return restApiServer;
};
