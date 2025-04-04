import { Request } from 'express';
import { expressjwt } from 'express-jwt';
import { ENV, HEADERS } from '#core/constants/index.js';
import { JWT_SIGN_ALGORITHM } from './security.constants.js';

export const jwtMiddleware = expressjwt({
  secret: ENV.TOKEN_AUTH_SECRET, // Verify token is valid (not expired nor manipulated)
  algorithms: [JWT_SIGN_ALGORITHM],
  getToken: (req: Request) => {
    const tokenWithBearer = req.cookies
      ? (req.cookies[HEADERS.AUTHORIZATION] as string)
      : '';

    const [, token] = tokenWithBearer?.split(`${HEADERS.BEARER} `) || [];

    return token;
  },
});
