import { createApp } from './express.server';
import { envConstants } from './env.constants';
import cors from 'cors';
import SocketIOClient, { Socket } from 'socket.io';

const app = createApp();

let http = require('http').Server(app);
// set up socket.io and bind it to our
// http server.
let io: SocketIOClient.Socket = require('socket.io')(http);

//options for cors midddleware
const options: cors.CorsOptions = {
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'X-Access-Token',
  ],
  credentials: true,
  methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
  // IMPORTANT LIMIT HERE YOUR CLIENT APPS DOMAINS
  origin: '*',
  preflightContinue: false,
};

app.use(cors(options));

app.listen(envConstants.PORT, () => {
  console.log(`Server ready at http://localhost:${envConstants.PORT}/api`);
});

// whenever a user connects on port 3000 via
// a websocket, log that a user has connected
io.on('connection', function (socket: Socket) {
  console.log('** connection recieved');
  socket.emit('message', { type: 'CONNECTION_SUCCEEDED' });

  socket.on('message', function (body: any) {
    console.log(body);
    io.emit('message', body);
  });
});

const server = http.listen(3000, function () {
  console.log('listening on *:3000');
});
