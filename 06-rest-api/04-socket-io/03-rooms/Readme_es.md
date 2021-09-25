# connection-params

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

_./src/app.tsx_

```diff
export const App = () => {
  const [message, setMessage] = React.useState("");
  const [chatlog, setChatlog] = React.useState("");
  const [isConnected, setIsConnected] = React.useState(false);
  const [socket, setSocket] = React.useState<globalThis.SocketIOClient.Socket>(
    null
  );
  const [nickname, setNickname] = React.useState("Pepe");
+ const [room, setRoom] = React.useState("Front End");
```

_./src/app.tsx_

```diff
    <>
      <label>Enter Nickname: </label>
      <input value={nickname} onChange={(e) => setNickname(e.target.value)} />
+      <label>Room: </label>
+      <select value={room} onChange={e => setRoom(e.target.value)}>
+        <option value="Front End">Front End</option>
+        <option value="Back End">Back End</option>
+        <option value="Devops">Devops</option>
+        <option value="Random">Random</option>
+      </select>
```

- Bien, vamos a pasarle el nombre de la habitacion en nuestra conexión (aquí sería buena idea agrupar esto en un objeto)

_./src/app.tsx_

```diff
  const establishConnection = () => {
-    const socketConnection = createSocket(nickname);
+    const socketConnection = createSocket(nickname, room);
```

_./src/api.tsx_

```diff
export const createSocket = (
  nickname: string,
+ room : string
): globalThis.SocketIOClient.Socket => {
  const url = baseSocketUrl;

  const options: SocketIOClient.ConnectOpts = {
-    query: { nickname },
+    query: { nickname, room },,
    timeout: 60000,
```

- Vamos al servidor, vamos a añadir al store la informacíon de la habitación en la que estamos:

_./back/src/app.ts_

```diff
io.on('connection', function (socket: Socket) {
  console.log('** connection recieved');
-  addUserSession(socket.conn.id, socket.handshake.query['nickname']);
+  addUserSession(socket.conn.id, socket.handshake.query['nickname'] as string, socket.handshake.query['room'] as string);
+  socket.join(socket.handshake.query['room']);
```

Bueno hacemos un _addUserSession_ para almacenarlo en nuestra _base de datos_ (memoria) pero... tenemos que decirle a _socket.io_
que ese usuario se registra en la habitación que indica, esto lo hacemos de la siguiente manera:

```diff
   addUserSession(socket.conn.id, socket.handshake.query['nickname'] as string, socket.handshake.query['room'] as string);
+  socket.join(socket.handshake.query['room']);
```

Añadimos

_./back/src/store.ts_

```diff
interface UserSession {
  connectionId: string;
  nickname: string;
+ room : string;
}

let userSession = [];

- export const addUserSession = (connectionId: string, nickname) => {
+ export const addUserSession = (connectionId: string, nickname  :string, room : string) => {
-  userSession = [...userSession, { connectionId, nickname}];
+  userSession = [...userSession, { connectionId, nickname, room }];
};
```

Y el getter...

_./back/src/store.ts_

```diff
- export const getNickname = (connectionId: string) => {
+ export const getUserInfo = (connectionId: string) : UserSession => {
  const session = userSession.find(
    (session) => session.connectionId === connectionId
  );

-  return session ? session : 'ANONYMOUS :-@';
+  return session ? session : {id: -1, nickname: 'ANONYMOUS :-@', room: 'devops' }
};
```

- Y Vamos a recogerla a la hora de enviar el mensaje que solo se envíe a los que estén en esa habitación:

_./backend/src/app.ts_

```diff
- import { addUserSession, getNickname } from './store';
+ import { addUserSession, getUserInfo } from './store';

// (...)

  socket.on('message', function (body: any) {
    console.log(body);
+   const userInfo = getUserInfo(socket.conn.id);
-    socket.broadcast.emit('message', {
+    io.to(userInfo.room).emit('message',{
      ...body,
      payload: {
        ...body.payload,
-        nickname: getNickname(socket.conn.id),
+        nickname: userInfo.nickname,
      },
    });
  });
```

- Arrancamos y... nos damos cuenta de que los mensajes salen dos veces en algunos casos ¿Qué pasa aquí?
  Que _io.to_ envía también al emisor, si miramos la chuleta podemos ver que el correcto es:

```bash
npm start
```

_./backend/src/app.ts_

```diff
  socket.on('message', function (body: any) {
    console.log(body);
   const userInfo = getUserInfo(socket.conn.id);
-  io.to(userInfo.room).emit('message',{
+  socket.to(userInfo.room).emit('message',{
```

> Importante el envío a salas se hace desde servidor, desde cliente no puedo elegir a que sala envío.
