# connection-params

Vamos a ver como puedo pasarle parametros con información a la hora de conectarnos.

## Pasos

- Partimos del ejercicio anterior, _01-hello-socket-io_

- Entramos en el back, instalamos las dependencias

```bash
npm install
```

- Hacemos lo mismo en el front

```bash
npm install
```

- Ahora vamos a esperar que el front nos informe del nickname del usuario que se va a conectar.

- En el Front vamos a probar a informar de un parametro harcodeado en la conexión:

_./front/src/api.ts_:

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

_./back/src/index.ts_:

```diff
io.on('connection', function (socket: Socket) {
  console.log('** connection recieved');
+  console.log(socket.handshake.query['nickname']);
  socket.emit('message', { type: 'CONNECTION_SUCCEEDED' });
```

- Si arrancamos podemos ver como aparece el id por la consola del servidor.

_En front y back_:

```bash
npm start
```

- Ahora queremos que el usuario introduzca el nombre que le apetezca y le de al botón de conectar.
- ¡Genial! Ya nos llega a servidor el valor. ¿Qué vamos a hacer ahora? Vamos a asociar el nickname al connectionId del websocket de cliente.
- Primero nos vamos a crear un sitio donde guardar esa info (lo ponemos en memoria en una aplicación real podría por ejemplo ir a base de de datos).

_./back/src/store.ts_:

```ts
interface UserSession {
  connectionId: string;
  nickname: string;
}

export interface ConnectionConfig {
  nickname: string;
}

let userSession: UserSession[] = [];

export const addUserSession = (
  connectionId: string,
  config: ConnectionConfig
) => {
  userSession = [...userSession, { connectionId, nickname: config.nickname }];
  console.log(`New user joined: ${config.nickname}`);
};

export const getNickname = (connectionId: string) => {
  const session = userSession.find(
    (session) => session.connectionId === connectionId
  );

  return session ? session.nickname : "ANONYMOUS :-@";
};
```

- Ahora lo guardamos.

_./back/src/index.ts_:

```diff
import './load-env.js';
import cors from 'cors';
import express from 'express';
import http from 'http';
import path from 'path';
import { Server, Socket } from 'socket.io';
import url from 'url';
import { createApp } from './express.server.js';
import { envConstants } from './env.constants.js';
import { api } from './api.js';
+ import { addUserSession, ConnectionConfig, getNickname } from './store.js';
```

_./back/src/index.ts_:

```diff
io.on('connection', function (socket: Socket) {
  console.log('** connection recieved');
-  console.log(socket.handshake.query['nickname']);
+  const config: ConnectionConfig = { nickname: socket.handshake.query['nickname'] as string };
+  addUserSession(socket.id, config);
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
+        nickname: getNickname(socket.id),
+      },
+    });
  });
```

- En el Front ya lo podemos mostrar

_./front/src/app.tsx_:

```diff
    case "CHAT_MESSAGE":
-     setChatlog((chatlog) => `${chatlog}\n${body.payload.content}`);
+     setChatlog((chatlog) => `${chatlog}\n[${body.payload.nickname}]${body.payload.content}`);
      break;
  }
```

- ¡Oye, pero aquí sale siempre _pepe_! No hay problema, vamos a añadir una caja de texto cuando un usuario se una para indicar el nickname.

_./front/src/app.tsx_:

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

_./front/src/app.tsx_:

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

_./front/src/app.tsx_:

```diff
  const establishConnection = () => {
-    const socketConnection = createSocket();
+    const socketConnection = createSocket(nickname);
```

_./front/src/api.ts_:

```diff
- export const createSocket = (): Socket => {
+ export const createSocket = (nickname: string): Socket => {

  const url = baseSocketUrl;

  const options: SocketIOClient.ConnectOpts = {
-    query: { nickname: "pepe" },
+    query: { nickname },
    timeout: 60000,
  };
```

- Vamos a probar:

_en front y back_:

```bash
npm start
```

## Bonus: ¿Cómo evitar nicknames duplicados?

- Añade la función `isNicknameUsed` para comprobar si el nickname está en uso. Si está en uso, la función `addUserSession` no añadirá el nuevo usuario al array (BD en memoria) de usuarios.

_./back/src/store.ts_:

```ts
interface UserSession {
  connectionId: string;
  nickname: string;
}

export interface ConnectionConfig {
  nickname: string;
}

let userSession: UserSession[] = [];

const isNicknameUsed = (newUserNickname: string): boolean =>
  userSession.some(session => session.nickname.toLowerCase() === newUserNickname.toLowerCase());

export const addUserSession = (
  connectionId: string,
  config: ConnectionConfig
): boolean => {
  if (isNicknameUsed(config.nickname)) {
    console.log(`Nickname '${config.nickname}' is already in use`);
    return false;
  } else {
    userSession = [...userSession, { connectionId, nickname: config.nickname }];
    console.log(`New user joined: ${config.nickname}`);
    return true;
  }
};

export const getNickname = (connectionId: string) => {
  const session = userSession.find(
    (session) => session.connectionId === connectionId
  );

  return session ? session.nickname : "ANONYMOUS :-@";
};
```

- Volvamos al `index.ts` para hacer uso de la nueva funcionalidad. Si no se ha podido añadir el usuario porque el nickname está en uso, enviamos un mensaje del tipo `NICKNAME_USED`.

_./back/src/index.ts_:

```ts
io.on("connection", (socket: Socket) => {
  console.log("** connection recieved");
  const config: ConnectionConfig = { nickname: socket.handshake.query['nickname'] as string };
  const isUserAdded = addUserSession(socket.id, config);
  if (isUserAdded) {
    socket.emit("message", { type: "CONNECTION_SUCCEEDED" });

    socket.on('message', (body: any) => {
      console.log(body);
      socket.broadcast.emit('message', {
        ...body,
        payload: {
          ...body.payload,
          nickname: getNickname(socket.id),
        },
      });
    });
  } else {
    socket.emit("message", { type: "NICKNAME_USED" });
  }
});
```

- En el front debemos escuchar este tipo de mensajes nuevos (`NICKNAME_USED`) para cerrar la conexión websocket.

_./front/src/app.tsx_:

```ts
const establishConnection = () => {
  const socketConnection = createSocket(nickname);
  socketConnection.on("message", (body) => {
    if (body && body.type) {
      switch (body.type) {
        case "CONNECTION_SUCCEEDED":
          setIsConnected(true);
          setSocket(socketConnection);
          console.log("Connection succeded");
          break;
        case "CHAT_MESSAGE":
          setChatlog((chatlog) => `${chatlog}\n[${body.payload.nickname}]${body.payload.content}`);
          break;
        case "NICKNAME_USED":
          alert(`Nickname '${nickname}' is already in use`);
          socketConnection.disconnect();
          break;
      }
    }
  });
};
```

- Y si se me cae la conexión que pasa?
