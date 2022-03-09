import { createApp } from './express.server';
import { envConstants } from './env.constants';
import { api } from './api';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { configPassport } from './setup';

const app = createApp();
app.use(cookieParser());

configPassport(passport);
// We need to setup the middleware
app.use(passport.initialize());

app.use('/', express.static(path.join(__dirname, 'static')));

app.use('/api', api);

app.listen(envConstants.PORT, () => {
  console.log(`Server ready at http://localhost:${envConstants.PORT}/api`);
});
