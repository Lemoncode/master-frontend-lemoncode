# Salas

Vamos a trabajar con un concepto muy interesante, las "salas"

# Pasos

- Copiamos el ejemplo anterior.

- Entramos en el back, instalamos paquetes

```bash
npm install
```

- Hacemos lo mismo en el front

```bash
npm install
```

- Ahora queremos que cuando un usuario entre elija en que sala va a hablar... si quiero hablar de coches para que me voy a meter en la de futbol.

- En el lado cliente vamos a crear la fontaneria de interfaz de usuario:

_./front/src/app.tsx_

```diff
export const App = () => {
  const [message, setMessage] = React.useState("");
  const [chatlog, setChatlog] = React.useState("");
  const [isConnected, setIsConnected] = React.useState(false);
  const [socket, setSocket] = React.useState<globalThis.SocketIOClient.Socket>(
    null
  );
  const [nickname, setNickname] = React.useState("");
+ const [room, setRoom] = React.useState("Front End");
```

_./front/src/app.tsx_

```diff
    <>
      <label>Enter Nickname: </label>
      <input value={nickname} onChange={(e) => setNickname(e.target.value)} />
+     <label>Room: </label>
+     <select value={room} onChange={e => setRoom(e.target.value)}>
+       <option value="Front End">Front End</option>
+       <option value="Back End">Back End</option>
+       <option value="Devops">Devops</option>
+       <option value="Random">Random</option>
+     </select>
```

- Bien, vamos a pasarle el nombre de la habitacion en nuestra conexión. Para ello, nos creamos en el fichero de api una interfaz llamada `SocketQuery`:

_./front/src/api.ts_

```diff
import { io, SocketOptions, Socket, ManagerOptions } from "socket.io-client";

const baseSocketUrl = "http://localhost:3000";

+ export interface SocketQuery {
+   nickname: string;
+   room: string;
+ }
```

_./front/src/app.tsx_

```diff
  const establishConnection = () => {
-    const socketConnection = createSocket(nickname);
+    const socketConnection = createSocket({ nickname, room });
```

_./front/src/api.tsx_

```diff
- export const createSocket = (nickname: string): Socket => {
+ export const createSocket = (query: SocketQuery): Socket => {
    const options: Partial<ManagerOptions & SocketOptions> = {
-     query: { nickname }
+     query,
      timeout: 60000,
    };

    return io(baseSocketUrl, options);
  };
```

- Vamos al servidor, vamos a añadir al store la informacíon de la habitación en la que estamos:

_./back/src/store.ts_

```diff
interface UserSession {
  connectionId: string;
  nickname: string;
+ room : string;
}

interface ConnectionConfig {
  nickname: string;
+ room: string;
}

let userSessions: UserSession[] = [];

export const addUserSession = (connectionId: string, config: ConnectionConfig) => {
  userSessions = [...userSessions, {
    connectionId,
    nickname: config.nickname,
+   room: config.nickname,
  }];
};
```

Hacemos un `addUserSession` para almacenarlo en nuestra _base de datos_ (memoria) pero... tenemos que decirle a _socket.io_ que ese usuario se registra en la habitación que indica, esto lo hacemos de la siguiente manera:

_./back/src/app.ts_

```diff
io.on('connection', function (socket: Socket) {
  console.log('** connection recieved');
  const config: ConnectionConfig = {
    nickname: socket.handshake.query['nickname'] as string,
+   room: socket.handshake.query['room'] as string
  }
  addUserSession(socket.id, config);
+ socket.join(config.room);
```

También tenemos que cambiar el getter. Ahora devolverá la info de la sesión, no el nickname únicamente.

_./back/src/store.ts_

```diff
- export const getNickname = (connectionId: string) => {
+ export const getUserInfo = (connectionId: string) : UserSession => {
  const session = userSessions.find(
    (session) => session.connectionId === connectionId
  );

-  return session && session.nickname !== "" ? session.nickname : 'ANONYMOUS :-@';
+  return session && session.nickname !== ""
+  ? {
+       connectionId: session.connectionId,
+       nickname: session.nickname,
+       room: session.room,
+    }
+ : { connectionId: '-1', nickname: 'ANONYMOUS :-@', room: 'devops' };
};
```

- Y vamos a recogerla a la hora de enviar el mensaje que solo se envíe a los que estén en esa habitación:

_./backend/src/app.ts_

```diff
- import { addUserSession, getNickname } from './store';
+ import { addUserSession, getUserInfo } from './store';

// (...)

  socket.on('message', function (body: any) {
    console.log(body);
+   const userInfo = getUserInfo(socket.id);
-   socket.broadcast.emit('message', {
+   io.to(userInfo.room).emit('message',{
      ...body,
      payload: {
        ...body.payload,
-       nickname: getNickname(socket.id),
+       nickname: userInfo.nickname,
      },
    });
  });
```

- Arrancamos y... nos damos cuenta de que los mensajes salen dos veces en algunos casos ¿Qué pasa aquí? Que _io.to_ envía también al emisor, si miramos la chuleta podemos ver que el correcto es:

_./backend/src/app.ts_

```diff
  socket.on('message', function (body: any) {
    console.log(body);
   const userInfo = getUserInfo(socket.id);
-  io.to(userInfo.room).emit('message',{
+  socket.to(userInfo.room).emit('message',{
```

> Importante el envío a salas se hace desde servidor, desde cliente no puedo elegir a que sala envío.
