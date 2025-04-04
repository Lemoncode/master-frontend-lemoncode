import { CookieOptions } from 'express';
import { ENV } from '#core/constants/index.js';

export const JWT_SIGN_ALGORITHM = 'HS256';

export const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: ENV.IS_PRODUCTION,
};
