import { Router } from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { profileRepository, User } from './dals';

export const api = Router();

api.get('/', async (req, res) => {
  res.send({ id: '1', name: 'test data' });
});

api.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false, // Default value: true
  })
);

const JWT_SECRET = 'MY_SECRET'; // TODO: Move to env variable
const COOKIE_NAME = 'authorization';
interface TokenPayload {
  id: number;
}

const createAccessToken = (userId: number) => {
  const payload: TokenPayload = {
    id: userId,
  };
  const token = jwt.sign(payload, JWT_SECRET);
  return token;
};

api.get(
  '/callback',
  passport.authenticate('google', { failureRedirect: '/', session: false }),
  (req, res) => {
    console.log('Ha llegado la respuesta de Google');
    console.log(req.user);
    const user = req.user as User;
    const token = createAccessToken(user.id);
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: false, // TODO: Enable in production
    });
    res.redirect('/mainapp.html');
  }
);

const getTokenPayload = async (token: string): Promise<TokenPayload> =>
  new Promise((resolve) => {
    jwt.verify(token, JWT_SECRET, (error, payload) =>
      error ? resolve(null) : resolve(payload as TokenPayload)
    );
  });

api.get('/user-profile', async (req, res) => {
  const token = req.cookies[COOKIE_NAME];
  const payload = await getTokenPayload(token);

  const user = await profileRepository.getUser(payload?.id);

  res.status(user ? 200 : 401).send(user);
});
