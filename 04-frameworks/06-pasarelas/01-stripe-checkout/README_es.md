# Stripe Checkout

[🇬🇧 English version](./README.md)

# Que vamos a cubrir

Vamos a configurar el kiosko de stripe (checkout) para hacer una compra (sin notificación a servidor, eso lo veremos en el siguiente ejemplo).

# Pasos

- Vamos a instalar la librería de servidor de stripe:

```bash
npm install stripe --save
```

- Creamos una hoja de estilo para que nuestras páginas tengan buena pinta (la del ejemplo de Stripe):

_./src/public/style.css_

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
    <script src="https://js.stripe.com/v3/"></script>
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

- El siguiente paso es el de crear una sesión en stripe para esta compra en conreto, el flujo:

  - La sesión se crea vía back channel (de servidor nuestro a servidor de stripe, así podemos firmar la petición con
    un secreto compartido).
  - Una vez que tengamos el session Id en servidor se lo pasamos a cliente para que pueda redirigir a la página de compra.

- Para poder crear una sesión nos hace falta tener una cuenta en stripe, en desarrollo nos da un par de claves de test, una publica
  y otra privada, la privada la almacenamos cómo variable de entorno (**Muy importante la clave privada de producción JAMAS la almacenamos
  en el repositorio**, de hecho incluso de te podrías plantear añadir a .gitignore el .env).

Para este ejemplo vamos a usar una clave genérica de stripe:

__

# ¿Con ganas de ponerte al día con Backend?

Apuntate a nuestro [Bootcamp Backend Online Lemoncode](https://lemoncode.net/bootcamp-backend#bootcamp-backend/banner)
