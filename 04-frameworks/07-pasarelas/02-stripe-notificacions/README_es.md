# Stripe Notificaciones

[🇬🇧 English version](./README.md)

## Que vamos a cubrir

Vamos a configurar un webhook para recibir notificaciones en nuestro backend cuando
una compra se complete

## Pasos

- Tomamos como punto de partida el ejemplo anterior, lo copiamos y hacemos un

  ```bash
  npm install
  ```

- Vamos parsear el cuerpo de lo que nos venga con JSON para ello hacemos uso del middleware de _json_ de express. **No olvidar quitar bodyparser !!**

  _./src/express.server.ts_

  ```diff
  import express from 'express';
  - import bodyParser from 'body-parser';
  const app = express();
  + app.use(express.json());
  - app.use(bodyParser.urlencoded({ extended: false }));
  - app.use(bodyParser.json());

  return app;
  ```

- En nuestro fichero de API vamos a definir un nuevo endpoint.

  _./src/api.ts_

  ```diff
  api.get('/', async (req, res) => {
    res.send({ id: '1', name: 'test data' });
  });

  + // Este va a ser el punto de entrada que buscará stripe
  + api.post('/webhook', (req, res) => {
  +   const payload = req.body;
  +
  +   // Aquí simplemente mostramos por consola lo que nos devuelve Stripe
  +   console.log(`Got payload: ${JSON.stringify(payload)}`);
  +
  +   res.status(200).end();
  + });
  ```

- Si ejecutamos esto y completamos una compra podemos ver que no se llama, ¿Qué esta pasando? Que Stripe de primeras no es capaz de encontrar localhost, lo cual es normal
- Podríamos probar a subirlo a un entorno en la nube y desde el dashbaord de Stripe definírselo, pero... es un poco rollo tener que hacer esto
- ¿No hay otra forma de poder probar en local? La respuesta es sí, usando el `stripe-cli`.
- Primero tenemos que instalarlo, para ello puedes seguir la guía que
  hay en la [página de stripe](https://stripe.com/docs/stripe-cli) esto cambia
  si estas en Windows, Mac o Linux.

  - _En mac_:

    ```bash
    brew install stripe/stripe-cli/stripe
    ```

  - _En windows_:

    [Descargarlo de este enlace](https://github.com/stripe/stripe-cli/releases/latest), elegir de la lista el fichero stripe_1.X.X_windows_x86_64.zip descomprimirlo y ejecutar el fichero exe.

    Para tener acceso al CLI en cualquier directorio de tu máquina puedes añadir a la variable de entorno `PATH` la ruta en la que tengas el fichero exe.

- También te va a hacer falta crearte una cuenta de Stripe y obtener tus claves de desarrollo.
- En nuestro clase copiaremos la clave privada a nuestro fichero de entorno.

  _./src/.env_

  ```diff
  NODE_ENV=development
  PORT=8081
  - STRIPE_SECRET=sk_test_7mJuPfZsBzc3JkrANrFrcDqC
  + STRIPE_SECRET=**PEGA AQUI TU CLAVE PRIVADA DE STRIPE (empieza por sk_text)**
  ```

- Hacemos un `stripe login` ([más info de como esto funciona en este enlace, sección notificaciones](https://lemoncode.net/lemoncode-blog/2021/1/13/pasarelas-de-pago-ii-stripe)) y autorizamos vía navegador

  ```bash
  stripe login
  ```

- Y ahora vamos a decirle usando al CLI de Stripe que todas las notificaciones de desarollo que vayan a nuestra cuenta las rediriga a `localhost:8081/api/webhook`

  ```bash
  stripe listen --forward-to localhost:8081/api/webhook
  ```

- Ahora ya podemos ver en la consola el payload recibido después de volver de la pasarela de pago. Podemos incluir otros `console.log` para ver con más claridad campos del objeto recibido tales como el id, el tipo, la fecha de creación o la versión de la API usada

  ```diff
  api.post('/webhook', (req, res) => {
    const payload = req.body;

    console.log(`Got payload: ${JSON.stringify(payload)}`);

  + console.log(`Id: ${req.body.id}`);
  + console.log(`Type: ${req.body.type}`);
  + console.log(`Creation date: ${new Date(req.body.created)}`);
  + console.log(`API version: ${req.body.api_version}`);

    res.status(200).end();
  });
  ```

- El comando `stripe listen` nos da un secreto para validar que las notificaciones vienen de Stripe y no de un impostor. Lo copiamos de la consola (empieza por _whsec\__).

  ![stripe listen](./resources/stripe_listen.png)

- Volvemos al fichero api.ts, al endpoint POST `webhook` para verificamos la firma.

  _./src/api.ts_

  ```diff
  + // Aquí copiamos y pegamos el código que nos dió el comando _stripe listen --forward_ (el que empieza + por whsec_)
  + // Lo suyo sería que estuvieran en una variable de entorno
  + const signingSecret = "whsec_...";

  api.post('/webhook', (req, res) => {
  + const sig = req.headers['stripe-signature'];
    const payload = request.body;

    // Aquí simplemente mostramos por consola lo que nos devuelve Stripe
    console.log('Got payload: ' + JSON.stringify(payload));

  +  try {
  +    // Tiramos de la librería de stripe para validar la respuesta usando el signingSecret
  +    // esto nos permite ver si el mensaje no viene de un impostor
  +    const event = stripe.webhooks.constructEvent(payload, sig, signingSecret);
  +  } catch (err) {
  +    return res.status(400).send(`Webhook Error: ${err.message}`);
  +  }

    res.status(200).end();
  });
  ```

- Vamos a ejecutar y comprobar que haciendo una compra nos sale por la notificacion por la consola del servidor de express (no cierres el terminal en el que se está ejecutando `stripe listen`).

  ```bash
  npm start
  ```

- Peero si lo paramos y depuramos vemos que la verificación no funciona (también podemos comprobarlo en la consola de `stripe listen`, veremos los errores 400 en el log) :-@, ¿Qué es lo que pasa? Que el body que le estamos pasando a Stripe para que verifique esta ya parseado a JSON y nos hace falta el original, ¿Qué podemos hacer? Además de traernos el contenido en JSON, traernos también el contenido en crudo, para ello tocamos el body parser de express:

  _./src/express.server.ts_

  ```diff
    app.use(
  -    express.json({
  +    express.json({
  +      verify: function (req, res, buf) {
  +        req['raw'] = buf;
  +      },
  +    })
  -    )
    );
  ```

- Y en el webhook tiramos del raw content para validar:

  _./src/api.ts_

  ```diff
  api.post('/webhook', (req, res) => {
    const sig = req.headers['stripe-signature'];
    const payload = req.body;
  + const rawBody = req['raw'];

    // Aquí simplemente mostramos por consola lo que nos devuelve Stripe
    console.log('Got payload: ' + JSON.stringify(payload));

    try {
      // Tiramos de la librería de stripe para validar la respuesta usando el endPointSecret
      // esto nos permite ver si el mensaje no viene de un impostor
  -   const event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  +   const event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    response.status(200).end();
  });
  ```

- Si probamos ahora podemos ver que la validación es correcta.

# ¿Con ganas de ponerte al día con Backend?

Apuntate a nuestro [Bootcamp Backend Online Lemoncode](https://lemoncode.net/bootcamp-backend#bootcamp-backend/banner)
