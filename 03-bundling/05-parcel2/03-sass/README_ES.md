# SASS

Vamos a añadir soporte para [SASS](https://sass-lang.com/)

# Pasos

## Prerequisitos

Instala [Node.js and npm](https://nodejs.org/en/) (min v8.9) si aún no está instalado en tu computadora.

> Verifica que estás ejecuatando al menos node v8.x.x and npm 5.x.x ejecutando `node -v` and `npm -v` en una terminal/consola. Las versiones anteriores pueden producir errores.

## Pasos

- Empezamos desde _02-custom-css_. Copiamos el proyecto e instalamos las dependencias.

```bash
npm install
```

- Sustituimos _css_ por archivos _sass_ y delegamos a _Parcel_ la intalación de dependencias.

- Vamos a renombrar _mystyles.css_ a _mystyles.scss_ y actualizamos el contenido.

_mystyles.scss_

```diff
+ $blue-color: teal;

.red-background {
- background-color: indianred;
+ background-color: $blue-color;
}
```

- Actualizemos también _index.js_

_./src/index.js_

```diff
- import './mystyles.css';
+ import './mystyles.scss';

const user = "John Doe";
console.log(`Hello ${user}!`);
```

- Ejecutamos la aplicación:

```bash
npm start
```

- Si *Parcel* no puede instalarlo, necesitamos instalar sass:

```bash
npm install sass --save-dev
```