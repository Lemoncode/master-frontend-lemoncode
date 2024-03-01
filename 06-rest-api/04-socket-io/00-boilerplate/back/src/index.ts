import './load-env.js';
import express from 'express';
import path from 'path';
import url from 'url';
import { createApp } from './express.server.js';
import { envConstants } from './env.constants.js';
import { api } from './api.js';

const app = createApp();

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const staticFilesPath = path.resolve(__dirname, envConstants.STATIC_FILES_PATH);
app.use('/', express.static(staticFilesPath));

app.use('/api', api);

app.listen(envConstants.PORT, () => {
  console.log(`Server ready at http://localhost:${envConstants.PORT}/api`);
});
