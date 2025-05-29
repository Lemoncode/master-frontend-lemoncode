import { StringValue } from 'ms';

export const ENV = {
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  PORT: Number(process.env.PORT),
  TOKEN_AUTH_SECRET: process.env.TOKEN_AUTH_SECRET,
  ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN as StringValue,
};
