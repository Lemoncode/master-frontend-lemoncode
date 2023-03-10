# connection-params

Vamos a ver como puedo pasarle parametros con información a la hora de conectarnos.

# Pasos

- Copiamos el ejemplo anterior, 01-hello-socket-io.

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

_./front/src/api.ts_

```diff
export const createSocket = (): globalThis.SocketIOClient.Socket => {
  const options: Partial<ManagerOptions & SocketOptions> = {
+   query: { nickname: "pepe" },
    timeout: 60000,
  };

  return ioClient(baseSocketUrl, options);
};
```

- En el backend vamos a probar a recoger este valor y mostrarlo por consola.

_./back/src/app.ts_

```diff
io.on('connection', function (socket: Socket) {
  console.log('** connection recieved');
+ console.log(socket.handshake.query['nickname']);
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

_./back/src/store.ts_

```ts
interface UserSession {
  connectionId: string;
  nickname: string;
}

export interface ConnectionConfig {
  nickname: string;
}

let userSessions: UserSession[] = [];

export const addUserSession = (
  connectionId: string,
  config: ConnectionConfig
) => {
  userSessions = [...userSessions, { connectionId, nickname: config.nickname }];
};

export const getNickname = (connectionId: string) => {
  const session = userSessions.find(
    (session) => session.connectionId === connectionId
  );

  return session ? session.nickname : "ANONYMOUS :-@";
};
```

- Ahora lo guardamos.

_./back/src/app.ts_

```diff
import { createApp } from './express.server';
import { envConstants } from './env.constants';
import { api } from './api';
import express from 'express';
import path from 'path';
import * as http from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
+ import { addUserSession, getNickname, ConnectionConfig } from './store';
```

_./back/src/app.ts_

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

_./front/src/app.tsx_

```diff
    case wsBodyTypes.chatMessage:
-      setChatlog((chatlog) => `${chatlog}\n${body.payload.content}`);
+      setChatlog((chatlog) => `${chatlog}\n[${body.payload.nickname}]${body.payload.content}`);
      break;
  }
```

- ¡Oye! pero aquí sale siempre PEPE :D, nada vamos a añadir una caja de texto cuando un usuario se una
  para indicar el nickname

_./front/src/app.tsx_

```diff
export const App = () => {
  const [message, setMessage] = React.useState("");
  const [chatlog, setChatlog] = React.useState("");
  const [isConnected, setIsConnected] = React.useState(false);
  const [socket, setSocket] = React.useState<globalThis.SocketIOClient.Socket>(
    null
  );
+  const [nickname, setNickname] = React.useState("");
```

_./front/src/app.tsx_

```diff
  <>
+   <label>Enter Nickname: </label>
+   <input value={nickname} onChange={(e) => setNickname(e.target.value)} />
    <button onClick={handleConnect} disabled={isConnected}>Join</button>
```

_./front/src/app.tsx_

```diff
  const establishConnection = () => {
-    const socketConnection = createSocket();
+    const socketConnection = createSocket(nickname);
```

_./front/src/api.ts_

```diff
- export const createSocket = (): Socket => {
+ export const createSocket = (nickname: string): Socket => {
  const options: SocketIOClient.ConnectOpts = {
-   query: { nickname: "pepe" },
+   query: { nickname },
    timeout: 60000,
  };
```

- Vamos a probar:

  _en front y back_

  ```bash
  npm start
  ```

- ¿Y si también queremos añadir una etiqueta a nuestros mensajes en el chat log?

  _./front/src/app.tsx_

  ```diff
    const sendMessage = (content: string) => {
  -   setChatlog(`${chatlog}\n${content}`);
  +   setChatlog(`${chatlog}\n[Me - ${nickname}]: ${content}`);
      socket.emit("message", {
        type: wsBodyTypes.chatMessage,
        payload: { content },
      });

      setMessage("");
    };
  ```

- ¿Y si nos unimos al chat sin introducir un nickname? Deberíamos de controlar ese caso también. Una forma de hacerlo es en la función `getNickname` de la store del backend.

  _./back/src/store.ts_

  ```diff
  export const getNickname = (connectionId: string) => {
    const session = userSessions.find(
      (session) => session.connectionId === connectionId
    );

  - return session  ? session.nickname : 'ANONYMOUS :-@';
  + return session && session.nickname !== "" ? session.nickname : 'ANONYMOUS :-@';
  };
  ```

> Ejercicios: si os queréis divertir...

- ¿ Cómo podría hacer para evitar nicknames duplicados?
- Y si se me cae la conexión que pasa?
