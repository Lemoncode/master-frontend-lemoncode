# Stripe Notificaciones

[🇬🇧 English version](./README.md)

# Que vamos a cubrir

Vamos a configurar un webhook para recibir notificaciones en nuestro backend cuando
una compra se complete

# Pasos

- Tomamos como punto de partida el ejemplo anterior, lo copiamos y hacemos un

```bash
npm install
```

- Vamos parsear el cuerpo de lo que nos venga con JSON para ello hacemos
  uso del middleware de _json_ de express.

_./src/app.ts_

```diff
const app = createApp();

+ app.use(express.json()); //Used to parse JSON bodies
app.use('/', express.static(path.join(__dirname, 'static')));

```

- En nuestro fichero de API vamos a definir un nuevo endpoint.

_./src/api.ts_

```diff
api.get('/', async (req, res) => {
  res.send({ id: '1', name: 'test data' });
});

+ // Este va a ser el punto de entrada que buscará stripe
+ api.post('/webhook', (request, response) => {
+  const payload = request.body;
+
+  // Aquí simplemente mostramos por consola lo que nos devuelve Stripe
+  console.log('Got payload: ' + JSON.stringify(payload));
+
+  response.status(200);
+ });
```

- Si ejecutamos esto y completamos una compra podemos ver que no se llama,
  ¿Qué esta pasando? Que stripe de primeras no es capaz de encontrar localhost,
  esto es normal, podríamos probar a subirlo a un entorno en la nube y desde el
  dashbaord de stripe definirselo, pero... es un poco rollo tener que hacer esto
  ¿No hay forma de poder probar en local? La respuesta es sí, usando el
  stripe-cli.

- Primero tenemos que instalarlo, para ello puedes seguir la guía que
  hay en la [página de stripe](https://stripe.com/docs/stripe-cli) esto cambia
  si estas en Windows, Mac o Linux.

En mac:

```bash
brew install stripe/stripe-cli/stripe
```

Si estás en Windows puedes usar scoop para instalarlo o [descargarlo de este enlace](https://github.com/stripe/stripe-cli/releases/tag/v1.5.6), elegir de la lista el fichero stripe_1.5.5_windows_x86_64.zip descomprimirlo y ejecutar el fichero exe para instalarlo.

- También te va a hacer falta crearte una cuenta de stripe y obtener tus claves de desarrollo,
  tanto la publica, como la privada.

- En nuestro clase copiaremos la clave privada a nuestro fichero de entorno, y la publicable a nuestro
  js.

_./src/.env_

```diff
NODE_ENV=development
PORT=8081
- STRIPE_SECRET=sk_test_4eC39HqLyjWDarjtT1zdp7dc
+ STRIPE_SECRET=**PEGA AQUI CLAVE PRIVADA DE STRIPE empieza por sk_text**
```

- También debemos de pegar la clave publica asociada en el index.html

_./src/static/index.html_

```diff

      var stripe = Stripe(
-        'pk_test_TYooMQauvdEDq54NiTphI7jx'
+        '** PEGA AQUI TU CLAVE PUBLICA***'
      );
      var checkoutButton = document.getElementById('checkout-button');
```

- Hacemos un stripe login ([más info de como esto funciona en este enlace, sección notificaciones](https://lemoncode.net/lemoncode-blog/2021/1/13/pasarelas-de-pago-ii-stripe))

```bash
stripe login
```

Autorizamos via navegador

- Y ahora vamos a decirle usando el stripe cli que todas las notificaciones de desarollo
  que vayan a nuestra cuenta las rediriga a

```bash
stripe listen --forward-to localhost:8081/api/webhook
```

- Esto nos da un secreto para validar que las notificaciones vienen de Stripe y no de un impostor,
  lo copiamos de la consola.

- Volvemos a api.ts en el post webhook, verificamos la firma.

_./src/api.ts_

```diff
+ // Aquí copiamos y pegamos el código que nos dió el comando _stripe listen --forward_ (el que empieza + por whsec_)
+ // Lo suyo sería que estuvieran en una variable de entorno
+ const endpointSecret = "whsec_...";

api.post('/webhook', (request, response) => {
+  const sig = request.headers['stripe-signature'];
  const payload = request.body;

  // Aquí simplemente mostramos por consola lo que nos devuelve Stripe
  console.log('Got payload: ' + JSON.stringify(payload));

+    let event;

+    try {
+      // Tiramos de la librería de stripe para validar la respuesta usando el endPointSecret
+      // esto nos permite ver si el mensaje no viene de un impostor
+      event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
+    } catch (err) {
+      return response.status(400).send(`Webhook Error: ${err.message}`);
+    }

  response.status(200);
});
```

- Vamos a ejecutar y comprobar que haciendo una compra nos sale por la notificacion por la consola
  del servidor de express (no cierres el terminal de stripe listen...).

```
npm start
```

- Podemos pararlo y probar a depurar.

# ¿Con ganas de ponerte al día con Backend?

Apuntate a nuestro [Bootcamp Backend Online Lemoncode](https://lemoncode.net/bootcamp-backend#bootcamp-backend/banner)
