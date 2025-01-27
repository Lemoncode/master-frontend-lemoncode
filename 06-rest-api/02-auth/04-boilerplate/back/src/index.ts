import express from 'express';
import { createRestApiServer } from '#core/servers/index.js';
import { ENV, API_ROUTES } from '#core/constants/index.js';
import { securityApi } from '#pods/security/index.js';
import { clientApi } from '#pods/client/index.js';
import { orderApi } from '#pods/order/index.js';

const app = createRestApiServer();
app.use(express.json());

app.use(API_ROUTES.SECURITY, securityApi);
app.use(API_ROUTES.CLIENTS, clientApi);
app.use(API_ROUTES.ORDERS, orderApi);

app.listen(ENV.PORT, () => {
  console.log(`Server running http://localhost:${ENV.PORT}`);
});
