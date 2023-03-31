# Stripe Checkout

[🇬🇧 English version](./README.md)

# Que vamos a cubrir

Vamos a configurar el kiosko de stripe (checkout) para hacer una compra (sin notificación a servidor, eso lo veremos en el siguiente ejemplo).

# Pasos

- Definimos un fichero de variables de entorno en local:

_./env_

```env
NODE_ENV=development
PORT=8081
```

- Podemos arrancar el proyecto y ver que hay en el boiler plate:

```bash
npm start
```

en http://localhost:8081 tenemos la página home

en http://localhost:8081/api tenemos un endpoint que devuelve datos

- Vamos a instalar la librería de servidor de stripe (esta ya trae los typings incorporados):

```bash
npm install stripe --save
```

- Creamos una hoja de estilo para que nuestras páginas tengan buena pinta (la del ejemplo de Stripe):

_./src/static/style.css_

```css
body {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #242d60;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
    'Helvetica Neue', 'Ubuntu', sans-serif;
  height: 100vh;
  margin: 0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
section {
  background: #ffffff;
  display: flex;
  flex-direction: column;
  width: 400px;
  height: 112px;
  border-radius: 6px;
  justify-content: space-between;
}
.product {
  display: flex;
}
.description {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
p {
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: -0.154px;
  color: #242d60;
  height: 100%;
  width: 100%;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}
img {
  border-radius: 6px;
  margin: 10px;
  width: 54px;
  height: 57px;
}
h3,
h5 {
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: -0.154px;
  color: #242d60;
  margin: 0;
}
h5 {
  opacity: 0.5;
}
#checkout-button {
  height: 36px;
  background: #556cd6;
  color: white;
  width: 100%;
  font-size: 14px;
  border: 0;
  font-weight: 500;
  cursor: pointer;
  letter-spacing: 0.6;
  border-radius: 0 0 6px 6px;
  transition: all 0.2s ease;
  box-shadow: 0px 4px 5.5px 0px rgba(0, 0, 0, 0.07);
}
#checkout-button:hover {
  opacity: 0.8;
}
```

- Vamos a crear la maquetacíon de la página (reemplazamos el contenido del fichero completo)

_./static/index.html_

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Buy cool new product</title>
    <link rel="stylesheet" href="style.css" />
    <script src="https://polyfill.io/v3/polyfill.min.js?version=3.52.1&features=fetch"></script>
  </head>
  <body>
    <section>
      <div class="product">
        <img
          src="https://i.imgur.com/EHyR2nP.png"
          alt="The cover of Stubborn Attachments"
        />
        <div class="description">
          <h3>Stubborn Attachments</h3>
          <h5>$20.00</h5>
        </div>
      </div>
      <button id="checkout-button">Checkout</button>
    </section>
  </body>
</html>
```

- Vamos a probar que se muestra la ventana aunque esta no tendrá funcionalidad (abrimos nuestro browser favorito y navegamos a http://localhost:8081).

```bash
npm start
```

- El siguiente paso es el de crear una sesión en stripe para esta compra en concreto, el flujo:

  - La sesión se crea vía back channel (de servidor nuestro a servidor de stripe, así podemos firmar la petición con
    un secreto compartido).
  - Una vez que tengamos el session Id en servidor se lo pasamos a cliente para que pueda redirigir a la página de compra.

- Para poder crear una sesión nos hace falta tener una cuenta en stripe, en desarrollo nos da un par de claves de test, una publica
  y otra privada, la privada la almacenamos cómo variable de entorno (**Muy importante la clave privada de producción JAMAS la almacenamos
  en el repositorio**, de hecho incluso de te podrías plantear añadir a .gitignore el .env).

Para este ejemplo vamos a usar una clave genérica de stripe
(Chequear [este enlace](https://stripe.com/docs/checkout/quickstart?lang=node#init-stripe) para ver si hay una clave diferente):

_./.env_

```diff
NODE_ENV=development
PORT=8081
+STRIPE_SECRET=sk_test_7mJuPfZsBzc3JkrANrFrcDqC
```

Y enlazarla a nuestro fichero de constantes:

_./env.constants.ts_

```diff
export const envConstants = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
+ STRIPE_SECRET: process.env.STRIPE_SECRET
};
```

- Y en el lado de los endpoints vamos a traernos  la librería
de servidor de stripe, como vamos a usar el import en modo genérico, vamos a configurar esto en nuetro tsconfig

_./tsconfig.json_

```diff
{
  "compilerOptions": {
    "target": "es6",
    "module": "es6",
    "moduleResolution": "node",
    "declaration": false,
    "noImplicitAny": false,
    "sourceMap": true,
    "noLib": false,
    "allowJs": true,
    "suppressImplicitAnyIndexErrors": true,
+    "allowSyntheticDefaultImports": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "baseUrl": "./src"
  },
  "include": ["src/**/*"]
}
```

- Vamos ahora a nuestro fichero de _api_ e importarnos Stripe, configurandolo con la cuenta que acabamos de introducir en nuestra variable de entorno.

_./src/api.ts_

```diff

import { Router } from 'express';
+ import Stripe from 'stripe';
+ import {envConstants} from './env.constants';

+ // https://github.com/stripe/stripe-node#usage-with-typescript
+ const stripe = new Stripe(envConstants.STRIPE_SECRET, {
+  apiVersion: null,
+ });

export const api = Router();

api.get('/', async (req, res) => {
  res.send({ id: '1', name: 'test data' });
});
```

- Vamos ahora a crear un endpoint que se llame _checkout_ que sera el que le pida a stripe crear una nueva sesión y nos devolvera un
  session Id de stripe que devolveremos a cliente, a destacar aquí:

  - Le decimos que sólo aceptamos tarjeta de crédito.
  - Le indicamos nuestro carrito de la compra (así Stripe lo muestra para confirmar).
  - Le indicamos lo que cuesta.
  - Le indicamos la dirección de ok y ko (transacción completada con éxito, o transacción errónea)

_./src/api.ts_

```diff
api.get('/', async (req, res) => {
  res.send({ id: '1', name: 'test data' });
});

+ api.post('/create-checkout-session', async (req, res) => {
+  const session = await stripe.checkout.sessions.create({
+    payment_method_types: ['card'],
+    line_items: [
+      {
+        price_data: {
+          currency: 'usd',
+          product_data: {
+            name: 'Stubborn Attachments',
+            images: ['https://i.imgur.com/EHyR2nP.png'],
+          },
+          unit_amount: 2000,
+        },
+        quantity: 1,
+      },
+    ],
+    mode: 'payment',
+    success_url: `http://localhost:${envConstants.PORT}/success.html`,
+    cancel_url: `http://localhost:${envConstants.PORT}/cancel.html`,
+  });
+
+  console.log("Session id:", session.id)
+  console.log("Session URL:", session.url);
+  res.redirect(303, session.url);
+});
```

- Vamos a definir la página de exito y la de error:

_./src/static/success.html_

```html
<html>
  <head>
    <title>Thanks for your order!</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <section>
      <p>
        We appreciate your business! If you have any questions, please email
        <a href="mailto:orders@example.com">orders@example.com</a>.
      </p>
    </section>
  </body>
</html>
```

_./src/static/error.html_

```html
<html>
  <head>
    <title>Checkout canceled</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <section>
      <p>
        Forgot to add something to your cart? Shop around then come back to pay!
      </p>
    </section>
  </body>
</html>
```

- Volvemos a la página en la que teníamos el botón de compra y vamos a manejar ese botón con Javascript:
  - Nos traemos el SDK de stripe en cliente de una CDN (es la forma que te indica stripe no es aconsejable meterlo en un bundle)
  - Llamamos a nuetro backend al endpoint de checkout.
  - Obtenemos el id de sesión de Stripe.
  - Redirigimos a la pasarela de Stripe.
  - Stripe ya tiene el mando, nos redirigirá a la página de success o de cancel según se complete la operación.

_./src/static/index.html_

```diff
<!DOCTYPE html>
<html>
  <head>
    <title>Buy cool new product</title>
    <link rel="stylesheet" href="style.css" />
    <script src="https://polyfill.io/v3/polyfill.min.js?version=3.52.1&features=fetch"></script>
+   <script src="https://js.stripe.com/v3/"></script>
  </head>
  <body>
    <section>
      <div class="product">
        <img
          src="https://i.imgur.com/EHyR2nP.png"
          alt="The cover of Stubborn Attachments"
        />
        <div class="description">
          <h3>Stubborn Attachments</h3>
          <h5>$20.00</h5>
        </div>
      </div>
+     <form action="/api/create-checkout-session" method="POST">
        <button id="checkout-button">Checkout</button>
+     </form>
    </section>
  </body>
</html>
```

- Vamos a probar que el proceso funciona.

```bash
npm start
```

Tarjetas para probar (ver [aquí](https://stripe.com/docs/checkout/quickstart?lang=node#testing)):

- El pago se efectúa correctamente: 4242 4242 4242 4242
- El pago requiere autenticación: 4000 0025 0000 3155
- Se rechaza el pago: 4000 0000 0000 9995

Para ver más tarjetas: [https://stripe.com/docs/testing?testing-method=card-numbers](https://stripe.com/docs/testing?testing-method=card-numbers)

# ¿Con ganas de ponerte al día con Backend?

Apuntate a nuestro [Bootcamp Backend Online Lemoncode](https://lemoncode.net/bootcamp-backend#bootcamp-backend/banner)
