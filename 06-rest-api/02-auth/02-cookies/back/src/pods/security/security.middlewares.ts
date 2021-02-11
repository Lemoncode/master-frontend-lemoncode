import { Request } from 'express';
import expressJwt from 'express-jwt';
import { envConstants, headerConstants } from 'core/constants';
import { jwtSignAlgorithm } from './security.constants';

export const jwtMiddleware = expressJwt({
  secret: envConstants.TOKEN_AUTH_SECRET, // Verify token is valid (not expired nor manipulated)
  algorithms: [jwtSignAlgorithm],
  getToken: (req: Request) => {
    const tokenWithBearer = req.cookies
      ? (req.cookies[headerConstants.authorization] as string)
      : '';

    const [, token] = tokenWithBearer?.split(`${headerConstants.bearer} `) || [];

    return token;
  },
});
