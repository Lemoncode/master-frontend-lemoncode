import { CookieOptions } from 'express';
import { envConstants } from 'core/constants';

export const jwtSignAlgorithm = 'HS256';

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: envConstants.isProduction,
};
