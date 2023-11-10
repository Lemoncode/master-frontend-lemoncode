# Manejo de imágenes

En esta demo vamos a incluir imágenes en nuestro proyecto de dos formas: vía _JavaScript_ y vía _HTML_.

Empezaremos del ejemplo _04-bootstrap_.

# Pasos para contruirlo

## Prerequisitos

Instala [Node.js and npm](https://nodejs.org/en/) (min v8.9) si aún no está instalado en tu computadora.

> Verifica que estás ejecuatando al menos node v8.x.x and npm 5.x.x ejecutando `node -v` and `npm -v` en una terminal/consola. Las versiones anteriores pueden producir errores.

## Pasos

- Empezaremos desde _04-boostrap_. Sólo tienes que copiar el proyecto y ejecutar _npm install_.

```bash
npm install
```

- Creamos una carpeta llamada **content** dentro de la carpeta **src**, y añadiendo dos imágenes allí: [`logo_1`](./src/content/logo_1.png) y [`logo_2`](./src/content/logo_2.png).

- Vamos a añadir un contenedor _div_ para colocar una imagen.

_./src/index.html_

```diff
  <h1>Check the console log</h1>
+ <div id="imgContainer"></div>
  <div class="red-background">RedBackground stuff</div>
```

- Entramos en _`index.js`_ e importamos [`logo_1`](./src/content/logo_1.png) utilizando _JavaScript_. A continuación, coloquémoslo bajo un `<div>` con un `id` dado:

_./src/index.js_

```diff
import './mystyles.scss';
+ import logoImg from './assets/logo_1.png';

const user = "John Doe";

console.log(`Hello ${user}!`);

+ const img = document.createElement('img');
+ img.src = logoImg;

+ document.getElementById('imgContainer').appendChild(img);
```

- Vamos a añadir estilos a las imágenes:

```javascript
img {
  width: 150px;
}
```

- Ahora, ¿qué pasa si ya tenemos la imagen referenciada dentro de una etiqueta _HTML_ `<img>`. Añadimos [`logo_2.png`](./src/content/logo_2.png) en el archivo index.html:

_./src/index.html_

```diff
  <h1>Check the console log</h1>
  <div id="imgContainer"></div>
  <div class="red-background">RedBackground stuff</div>
    <div class="card" style="width: 18rem">
+     <img src="./assets/logo_2.png" class="card-img-top" alt="logo lemoncode" />
```

- Vamos a ejecutar el ejemplo.

```bash
npm start
```

- Podemos ver que el paquete resuelve las imágenes `src` para cargarlas correctamente en el servidor.
