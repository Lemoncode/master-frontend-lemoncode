import { createApp } from './express.server';
import { envConstants } from './env.constants';
import { api } from './api';
import express from 'express';
import path from 'path';
import { configPassport } from './setup';
import passport from 'passport';
import expressSession from 'express-session';

const app = createApp();

configPassport(passport);

// Let's have a sessión (stored in memory by default, it could be serialized in a mongodb)
// TODO: in the future we could store info in JWT token
app.use(
  expressSession({
    secret: 'rather store secret in dotenv',
    resave: false,
    saveUninitialized: false,
  })
);

// We need to setup the middleware
app.use(passport.initialize());
// If we setup session we need serializeUser and deserializeUser
app.use(passport.session());

app.use('/', express.static(path.join(__dirname, 'static')));

app.use('/api', api);

app.listen(envConstants.PORT, () => {
  console.log(`Server ready at http://localhost:${envConstants.PORT}/api`);
});
