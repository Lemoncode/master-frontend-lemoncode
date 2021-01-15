import { createApp } from 'core/servers';
import { apiRouteConstants, envConstants } from 'core/constants';
import { securityApi } from 'pods/security';
import { clientApi } from 'pods/client';
import { orderApi } from 'pods/order';

const app = createApp();

app.use(apiRouteConstants.security, securityApi);
app.use(apiRouteConstants.client, clientApi);
app.use(apiRouteConstants.order, orderApi);

app.listen(envConstants.PORT, () => {
  console.log(`Server ready at http://localhost:${envConstants.PORT}`);
});
