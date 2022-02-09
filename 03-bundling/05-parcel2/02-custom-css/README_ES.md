# Custom CSS

Vamos a empezar a trabajar con estilos.

En esta demo vamos a crear un archivo _Custom CSS_ donde vamos a estrablecer un color de fondo en rojo.

Partimos de _01-basic_

Sumario:

- Crearemos un archivo _css_.
- Lo usaremos en nuestra página principal.

# Pasos:

## Prerequisitos

Instala [Node.js and npm](https://nodejs.org/en/) (min v8.9) si aún no está instalado en tu computadora.

> Verifica que estás ejecuatando al menos node v8.x.x and npm 5.x.x ejecutando `node -v` and `npm -v` en una terminal/consola. Las versiones anteriores pueden producir errores.

## Pasos

- Empezaremos de _01-basic_. Haz una copia del proyecto y ejecuta _npm install_.

```cmd
npm install
```

- Vamos a crear un archivo para los estilos _mystyles.css_

_./src/mystyles.css_

```css
.red-background {
  background-color: indianred;
}
```

- Importamos el archivo _css_ a nuestro _index.js_:

_./src/index.js_

```diff
+ import './mystyles.css';

const user = "John Doe";
console.log(`Hello ${user}!`);
```

- Y ahora podemos usar este estilo directamente en nuestro _HTML_. Actualicemos:

_./src/index.html_

```diff
<html>
<body>
  <h1>Check the console log</h1>
+ <div class="red-background">
+  RedBackground stuff
+ </div>
  <script type="module" src="./index.js"></script>
</body>
</html>
```

- Una vez actualizado el archivo _html_, vamos a arrancar el proyecto:

```cmd
npm start
```

- Vamos a checkear los archivos de la _build_. Por ejemplo, en el archivo _html_ construidos, vemos que _Parcel_ ha agregado la dependencia _css_:

_./dist/index.html_

```diff
<html>
+  <link rel="stylesheet" href="/index.f5179781.css">
<body>
  <h1>Check the console log</h1>
  <div class="red-background">RedBackground stuff</div>
  <script src="/src.fec37933.js"></script>
</body>
</html>
```
