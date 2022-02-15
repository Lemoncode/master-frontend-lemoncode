# Importando bootstrap

En esta demo instalaremos y configuraremos _parce_ para importar la conocida librería CSS de [Bootstrap](https://getbootstrap.com/).

Partimos de la demo anterior _03 SASS_.

# Pasos para contruirlo

## Prerequisitos

Instala [Node.js and npm](https://nodejs.org/en/) (min v8.9) si aún no está instalado en tu computadora.

> Verifica que estás ejecuatando al menos node v8.x.x and npm 5.x.x ejecutando `node -v` and `npm -v` en una terminal/consola. Las versiones anteriores pueden producir errores.

## Pasos

- Partimos de _03 SASS_. Sólo hay que copiar el proyecto y ejecutar _npm install_.

```cmd
npm install
```

- Vamos a instalar bootstrap

```bash
npm install bootstrap --save
```

- Actualicemos nuestro _HTML_ para incluir un enlace a _bootstrap_.

_./srsc/index.html_

```diff
<html>
+ <head>
+     <link rel="stylesheet" href="../node_modules/bootstrap/dist/css/bootstrap.css">
+ </head>
<body>
  <h1>Check the console log</h1>
```

- Modifiquemos nuestro _index.html_ e incluyamos algún componente específico de _bootstrap_.

```diff
...
<body>
  <h1>Check the console log</h1>
+  <div class="card" style="width: 18rem">
+    <div class="card-body">
+      <h5 class="card-title">Card title</h5>
+      <p class="card-text">
+        Some quick example text to build on the card title and make up the
+        bulk of the card's content.
+      </p>
+      <a href="#" class="btn btn-primary">Go somewhere</a>
+    </div>
+  </div>
  <div class="red-background">
      RedBackground stuff
  </div>
  <script type="module" src="./index.js"></script>
</body>
</html>
```

- Comencemos el proyecto y verifiquemos que los estilos de _Bootstrap_ funcionan correctamente.