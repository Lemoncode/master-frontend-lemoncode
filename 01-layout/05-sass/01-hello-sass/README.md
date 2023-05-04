# Hello sass

Antes de entrar en detalles vamos a jugar un poco con SASS.

Vamos a empezar a trabajar con el siguiente HTML

```diff
<body>
+ <div class="container">
+ <p>HTML Training</p>
+ <main>
+ <p>Hello Lemoncoders</p>
+ </main>
+ </div>
</body>
```

Vamos a pasar al lado del CSS, vamos a añadir un contenedor
y vamos a indicar que todos los párrafos dentro de ese contenedor
tendrán una fuente más grande:

```css
div.container {
  padding: 15px;
  border: 1px solid black;
}

div.container p {
  font-size: 125%;
}
```

Ahora vamos a indicar que sólo los párrafos hijos directos de ese contenedor
tengan aplicadas las propiedades de negrita y cursiva.

```diff
div.container {
  padding: 15px;
  border: 1px solid black;
}

div.container p {
  font-size: 125%;
}

+ div.container > p {
+ font-style: italic;
+ font-weight: bold;
+ }
```

Todo este código puede ser un poco desordenado, ¿y si pudiéramos anidar todas estas
reglas? Empecemos con la magia de SASS.

En primer lugar vamos a cambiar el nombre del archivo de la hoja de estilo, vamos a
actualizaremos la extensión de _.css_ a _.scss_ y actualizaremos el correspondiente
enlace HTML:

```diff
<head>
<title>Parcel Sandbox</title>
<meta charset="UTF-8" />
- <link href="./src/styles.css" />
+ <link rel="stylesheet" href="./styles.scss" />
</head>
```

Ahora vamos a anidar los selectores (veremos esto con más detalle más adelante):

```diff
div.container {
  padding: 15px;
  border: 1px solid black;
+
+ p {
+   font-size: 125%;
+ }
+
+ & > p {
+   font-style: italic;
+   font-weight: bold;
+ }
}
- div.container p {
- font-size: 125%;
- }
-
- div.container > p {
- font-style: italic;
- font-weight: bold;
- }
```

Todas estas características no son soportadas por CSS por eso hemos cambiado
la extensión a _scss_ por lo que necesitaremos un agente que nos haga una
conversión de SASS a CSS, sólo para permitir que el navegador consuma el
CSS estándar generado.

Esta transformación se realiza en tiempo de build.

Para seguir con parcel seguir los siguientes pasos:

- crear una nueva carpeta sass
- npm init
- crear src
- copiar en esa carpeta index.html y style
- npx parcel src/index.html
