import { createApp } from './express.server';
import { envConstants } from './env.constants';
import { api } from './api';
import express from 'express';
import path from 'path';
import * as http from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import { addUserSession, ConnectionConfig, getUserInfo } from './store';

const app = createApp();

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

// set up socket.io and bind it to our
// http server.
// https://socket.io/docs/v3/handling-cors/
const socketapp = new http.Server(app);
const io = new Server(socketapp, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use('/', express.static(path.join(__dirname, 'static')));

app.use('/api', api);

app.listen(envConstants.PORT, () => {
  console.log(`Server ready at http://localhost:${envConstants.PORT}/api`);
});

const server = socketapp.listen(3000, function () {
  console.log('listening on *:3000');
});

// whenever a user connects on port 3000 via
// a websocket, log that a user has connected
io.on('connection', function (socket: Socket) {
  console.log('** connection recieved');
  const config: ConnectionConfig = {
    nickname: socket.handshake.query['nickname'] as string,
    room: socket.handshake.query['room'] as string,
  };
  addUserSession(socket.id, config);
  socket.join(config.room);

  socket.emit('message', { type: 'CONNECTION_SUCCEEDED' });

  socket.on('message', function (body: any) {
    console.log(body);
    const userInfo = getUserInfo(socket.id);

    socket.to(userInfo.room).emit('message', {
      ...body,
      payload: {
        ...body.payload,
        nickname: userInfo.nickname,
      },
    });
  });
});
