import { createApp } from 'core/servers';
import { apiRouteConstants, envConstants } from 'core/constants';
import { securityApi, jwtMiddleware } from 'pods/security';
import { clientApi } from 'pods/client';
import { orderApi } from 'pods/order';

const app = createApp();

app.use(apiRouteConstants.security, securityApi);
app.use(apiRouteConstants.client, jwtMiddleware, clientApi);
app.use(apiRouteConstants.order, jwtMiddleware, orderApi);

app.listen(envConstants.PORT, () => {
  console.log(`Server ready at http://localhost:${envConstants.PORT}`);
});
