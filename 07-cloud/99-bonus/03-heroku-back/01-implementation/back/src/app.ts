import { envConstants } from 'core/constants';
import { createApp, connectToDBServer } from 'core/servers';
import { memberApi } from 'pods/member';

const app = createApp();

app.use('/members', memberApi);

app.listen(envConstants.PORT, async () => {
  await connectToDBServer(envConstants.MONGODB_URI);
  console.log(`Server ready at PORT ${envConstants.PORT}`);
});
