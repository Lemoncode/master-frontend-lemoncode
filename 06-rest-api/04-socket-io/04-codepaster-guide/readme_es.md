# Code Paster

Vamos a ver la arquitectura de este proyecto, nos metemos con algo un poco más complejo que necesita de
un código mantenible, que manejamos aquí:

- Usuarios profesores que pueden escribir.
- Usuarios alumnos que leen la información.
- Salas, un profesor crea una sala a la que los alumnos se conectan.

En cuanto a funcionalidad:

- La manera más fácil para un profe de crear una sala es darle a un botón :) (se añade enlace de sala en la url).
- La manera más fácil para un alumno de acceder a una sala es pasarle un enlace (la url de la sala).

# Back

A nivel de back:

- Para el store utilizamos una base de datos mongoDB (fíjate que usamos un contenedor Docker para levantarla en desarrollo, veremos más sobre Docker en el módulo de cloud).

## App

En el app

_./src/app.ts_

Añadimos la conexión al socket (esta vez usamos el mismo puerto que la api rest).

Llamos a createSocketServer

_./src/socket.server.ts_

Fijate que aquí ya sólo nos conectamos y delegamos en un pod de gestión de mensajes (el _messagesocketEvents_)

## pod messages

_messageSocketEvents_

Aquí de entrada en la conexión manejamos el evento de me he conectado como profesor o estudiante:

- Fijate que la lógica la delegamos en _processInputMessage_ (aquí podemos guardar el id de la conexión del alumno y ponerlo a escuchar de la habitación que toque, etc...).
- Lo que devuelva _processInputMessage_ lo pasamos a _processOutputMessage_ (por ejemplo podríamos notificar al profesor que un estudiante se ha conectado).

Después para los mensajes que recibamos (envío código, o quiero leer código del profesor), nos quedamos escuchando y mismo procedmiento llamamos a _processInputMessage_ y el resultado lo pasamos a _processOutputMessage_

### ProcessInputMessage

En el input tenemos un switch donde manejamos cada mensaje de entrada (esto se puede dividir si crece), realizamos la acción que toque contra base de datos y si hace falta generamos una lista de acciones de salida.

### ProcessOutputMessage

Aquí recibimos que mensajes de salida queremos enviar (por ejemplo que el profesoer envía nuevo código, o que quiere reenviar todo el código) y lo lanzamos por los sockets.

## Room pod

Aparte de esto tenemos un pod para la creación de salas (esto es parte de lo que pasa cuando pulsamo en el boton _Create session_)

# Front End

El Front End es muy estándar, arquitecturade PODS.

Y tenemos tres pods que mapean con páginas principales:

- CreateSession
- Trainer
- Student

## CreateSession

Nos podemos quedar en el container, fijate que aquí lo único que hacemos es pedir un nombre de sesión
libre y navegar a la página del profesor.

# Trainer

Podemos ver la lógica en Trainer container.

En cuanto la página se carga, llamamos a handleConnection, se establece conexión con el servidor,
pasandole la habitación y el token del profesor y nos quedamos escuchando a los mensajes.

Fijate que tenemos que utilizar un Ref para guardar el socket (pista, viene de un callback...)

En el switch conforme recibimos mensajes vamos actualizando el contenido.

También tenemos métodos para enviar contenido.

Este container huele a que se podría simplificar y _vaciar el cangrejo_, ¿Custom hook? ¿Sacar a api?
si alguien se anima a por ello, refactor al canto :))

# Student

El Student container es muy similar al trainer solo que más simple, en este caso sólo escuhamos
eventos que vengan del profesor (ver student.container)).

# Miscelaneo

A nivel front fijate que en common-app hemos puesto una cabecera y footer.

A nivel de componentes reusables, podemos echar un ojo a:

- AutoScrollHook: para ir actualizando el scroll del estudiante conforme se añaden
- use-with-ref: añadiendo un poco de azucar genérico a useRef, en el setter actualizamos el estado y el ref.
