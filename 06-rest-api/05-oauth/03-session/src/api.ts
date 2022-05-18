import { Router } from 'express';
import passport from 'passport';

export const api = Router();

api.get('/', async (req, res) => {
  res.send({ id: '1', name: 'test data' });
});

api.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

api.get(
  '/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    console.log(req.user);
    console.log('Llego respuesta de google');
    res.redirect('/mainapp.html');
  }
);

api.get('/user-profile', async (req, res) => {
  let user = null;
  // user Id can be found in: req.session['passport'].user
  // you can find whole user Info in req.user (passport middleware serialize and deserialize takes care of this)
  /*
  if (req.session['passport'].user) {
    user = await sessionRepository.getUser(req.session['passport'].user);
  }*/

  res.json(req.user);
});
