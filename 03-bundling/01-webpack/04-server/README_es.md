# 04 server

En éste ejemplo vamos a entrar en "dev mode" (modo desarrollador). Trabajando con el servicio de archivos
no es lo ideal cuando estás desarrollando la aplicación web, aprenderemos como lanzar
un servidor web ligero, como desplegar nuestro bundler en una carpeta dist ( incluyendo el archivo `index.html`),
como depurar nuestro codigo ES6 directamente en el depurador de nuestro navegador y minificar
nuestro `bundle.js`.

Empezaremos desde el ejemplo _03 Import_, instala `webpack-dev-server`, preparar nuestra configuración
para implementar en la carpeta config y mapas de soporte (depuración), entonces minificaremos
nuestro archivo `bundle.js` por la vía de los parámetros de webpack cli (cli = command line interface).

Resumen de los pasos:

- Instalar vía npm webpack-dev-server.
- Ejecutar webpack-dev-server con la recarga en vivo.
- Añade el comando start en el `package.json`.

# Pasos para construirlo

## Prerequisitos

Prerequisitos, necesitarás tener nodejs (al menos la versión: v 8.9.2) instalada en tu ordenador. Si quieres seguir esta guía de pasos necesitarás coger como punto de partida el ejemplo _02 Import_.

## Pasos

- `npm install` para instalar los paquetes previos necesarios:

```
npm install
```

- Vamos a instalar `webpack-dev-server`, envío de paquetes con un lite server que
  podemos usar como servidor de desarrollo web.

```
npm install webpack-dev-server --save-dev
```

- Vamos a reconfigurar nuestro _package.json_ comando _start_ y añadimos un nuevo comando customizado que llamaremos _build_.

### ./package.json

```diff
  "scripts": {
-   "start": "webpack --mode development"
+   "start": "webpack serve",
+   "build": "webpack --mode development"
  },
```

- Antes de ejecutar el proyecto, tenemos que darnos cuenta de que éste servidor se ejecuta en la memoria y no volcará información en la carpeta
  _dist_, ahora mismo efectuaremos una solución alternativa, actualizaremos la ruta del archivo index.html para el archivo _bundle.js_,
  en ejemplos posteriores aprenderemos una mejor forma de referenciar a los archivos incluidos en el HTML (usando HTMLWebpackPlugin)

_index.html_

```diff
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Webpack 5.x by sample</title>
  </head>
  <body>
    Hello Webpack 5!
-    <script src="./dist/main.js"></script>
+    <script src="main.js"></script>
  </body>
</html>

```

- Ahora si escribimos desde la terminal de nuestro sistema.

```bash
npm start
```

- Si abrimos un navegador podemos apuntar la url a http://localhost:8080 y navegaremos a nuestra aplicación web.

- Una característica interesante que incluye éste servidor de desarrollo es **live reloading**, así cualquier cambio introducido en algún archivo JavaScript será automaticamente detectado y webpack dev server lanzará el proceso de build y una vez terminado, refrescará automaticamente la página que se muestra en el navegador. Para realizar ésto, no necesitamos hacer nada.

- Si queremos ejecutar la build de _webpack_, solo necesitamos escribir los comandos desde la terminal de nuestro sistema:

```bash
npm run build
```

- Finalmente, podemos configurar este servidor en _`webpack.config.js`_:

_./webpack.config.js_

```diff
module.exports = {
  entry: ['./students.js'],
  output: {
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
+ devServer: {
+   port: 8081,
+ },
};

```

- Ahora, se está ejecutando en el puerto 8081.

- Podemos restablecer el puerto predeterminado:

_./webpack.config.js_

```diff
module.exports = {
  entry: ['./students.js'],
  output: {
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  devServer: {
-   port: 8081,
+   port: 8080,
  },
};
```

# Sobre Basefactor + Lemoncode

Somos un equipo innovador de expertos en Javascript, apasionados por convertir sus ideas en productos sólidos.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) proporciona servicios de consultoría y coaching.

[Lemoncode](http://lemoncode.net/services/en/#en-home) proporciona servicios de formación.

Para la audiencia Latino-Americana/Española tenemos un título en Máster Online Front End, mas info: http://lemoncode.net/master-frontend
