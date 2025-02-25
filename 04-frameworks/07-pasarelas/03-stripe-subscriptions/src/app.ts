import { createApp } from './express.server';
import { envConstants } from './env.constants';
import { api } from './api';
import express from 'express';
import path from 'path';

const app = createApp();

app.use(express.json());

app.use('/', express.static(path.join(__dirname, 'static')));

app.use('/api', api);

app.listen(envConstants.PORT, () => {
  console.log(`Server ready at http://localhost:${envConstants.PORT}/api`);
});
