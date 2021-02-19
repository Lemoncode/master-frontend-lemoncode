# connection-params

Vamos a ver como puedo pasarle parametros con información a la hora de conectarnos.

# Pasos

- Copiamos el ejemplo anterior de Hello socket.

- Entramos en el back, instalamos paquetes

```bash
npm install
```

- Hacemos lo mismo en el front

```bash
npm install
```

- Ahora vamos a esperar que el front nos informe del nickname del usuario que se va a conectar.

- En el Front vamos a probar a informar de un parametro harcodeado en la conexión:

_./frontend/src/api.ts_

```diff
export const createSocket = (): globalThis.SocketIOClient.Socket => {
  const url = baseSocketUrl;

  const options: Partial<ManagerOptions & SocketOptions> = {
+   query: { nickname: "pepe" },
    timeout: 60000,
  };

  return ioClient(baseSocketUrl, options);
};
```

- En el backend vamos a probar a recoger este valor y mostrarlo por consola.

_./backend/src/app.ts_

```diff
io.on('connection', function (socket: Socket) {
  console.log('** connection recieved');
+  console.log(socket.handshake.query['nickname']);
  socket.emit('message', { type: 'CONNECTION_SUCCEEDED' });
```

- Si arrancamos podemos ver como aparece el id por la consola del servidor.

_En front y back_

```bash
npm start
```

- Seguimos ahora queremos que el usuario introduzca el nombre que quiera y el de a conectar:

- ¡Genial! ya nos llega a servidor el valor, ¿Qué vamos a hacer ahora? Vamos a asociar el nickname
  al connectionId del websocket de cliente asociado

- Primero nos vamos a crear un sitio donde guardar esa info (lo ponemos en memoria en una aplicación
  real podría por ejemplo ir a base de de datos).

_./backend/src/store.ts_

```ts
interface UserSession {
  connectionId: string;
  nickname: string;
}

let userSession = [];

export const addUserSession = (connectionId: string, nickname) => {
  userSession = [...userSession, { connectionId, nickname }];
};

export const getNickname = (connectionId: string) => {
  const session = userSession.find(
    (session) => session.connectionId === connectionId
  );

  return session ? session.nickname : "ANONYMOUS :-@";
};
```

- Ahora lo guardamos.

_./backend/src/app.ts_

```diff
import { createApp } from './express.server';
import { envConstants } from './env.constants';
import { api } from './api';
import express from 'express';
import path from 'path';
import * as http from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
+ import { addUserSession, getNickname } from './store';
```

_./backend/src/app.ts_

```diff
io.on('connection', function (socket: Socket) {
  console.log('** connection recieved');
-  console.log(socket.handshake.query['nickname']);
+  addUserSession(socket.conn.id, socket.handshake.query['nickname']);
```

- Y cuando enviamos un mensaje ampliamos e indicamos el nick name de quien lo envió.

```diff
  socket.on('message', function (body: any) {
    console.log(body);
-    socket.broadcast.emit('message', body);
+    socket.broadcast.emit('message', {
+      ...body,
+      payload: {
+        ...body.payload,
+        nickname: getNickname(socket.conn.id),
+      },
+    });
  });
```

- En el Front ya lo podemos mostrar

_./src/front/app.ts_

```diff
    case "CHAT_MESSAGE":
-      setChatlog((chatlog) => `${chatlog}\n${body.payload.content}`);
+      setChatlog((chatlog) => `${chatlog}\n[${body.payload.nickname}]${body.payload.content}`);
      break;
  }
```

- ¡Oye! pero aquí sale siempre PEPE :D, nada vamos a añadir una caja de texto cuando un usuario se una
  para indicar el nickname

_./src/app.tsx_

```diff
export const App = () => {
  const [message, setMessage] = React.useState("");
  const [chatlog, setChatlog] = React.useState("");
  const [isConnected, setIsConnected] = React.useState(false);
  const [socket, setSocket] = React.useState<globalThis.SocketIOClient.Socket>(
    null
  );
+  const [nickname, setNickname] = React.useState("Pepe");
```

_./src/app.tsx_

```diff
  <>
+    <label>Enter Nickname: </label>
+    <input
+      value={nickname}
+      onChange={(e) => setNickname(e.target.value)}
+    />
    <button onClick={handleConnect} disabled={isConnected}>
      Join
    </button>

```

_./src/app.tsx_

```diff
  const establishConnection = () => {
-    const socketConnection = createSocket();
+    const socketConnection = createSocket(nickname);
```

_./src/api.ts_

```diff
- export const createSocket = (): Socket => {
+ export const createSocket = (nickname:string): Socket => {

  const url = baseSocketUrl;

  const options: SocketIOClient.ConnectOpts = {
-    query: "nickname=pepe",
+    query: {nickname},
    timeout: 60000,
  };
```

- Vamos a probar:

_en front y back_

```bash
npm start
```

> Ejercicios: si os queréis divertir...

- ¿ Cómo podría hacer para evitar nicknames duplicados?
- Y si se me cae la conexión que pasa?
