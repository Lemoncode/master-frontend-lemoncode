# Basics

Tenemos la posibilidad de hacer estos ejercicios de dos formas:

- Con Codesandbox: <https://codesandbox.io/>
- En local descargando el Visual Code. <https://code.visualstudio.com/>

Con visual Code:

- Creamos una carpeta "Layout"
- Abrimos en Visual Code desde esa Carpeta
- Creamos un fichero "index.html"
- Usamos la plantilla html5 para crear el esquelo de la web

```diff
<body>
+  <h1>Welcome to CSS</h1>
+  <h2>Basic example</h2>
</body>
```

Vamos a añadir estilos inline:

```diff
- <body>
+ <body style="background-color: brown">
<h1>Welcome to CSS</h1>
<h2>Basic example</h2>
```

Vamos a hacer lo mismo con los h1 y h2

```diff
- <h1>Welcome to CSS</h1>
+ <h1 style="color: white">Welcome to CSS</h1>
- <h2>Basic example</h2>
+ <h2 style="color: white">Basic example</h2>
```

Es la mejor solucione para el problema? Que opinais?

- Esta acoplada.
- Problema de ir copiando y pegando la solucion.
- ...

Vamos a desacoplar los estilos en un primer paso:

```diff
<head>
<title>Parcel Sandbox</title>
<meta charset="UTF-8" />
+ <style>
+ body {
+ background-color: brown
+ }
+ h1 {
+ color: white
+ }
+ h2 {
+ color: white
+ }
+ </style>
</head>
```

Y eliminamos los estilos inline:

```diff
- <body style="background-color: brown;">
+ <body>
- <h1 style="color: white;">Welcome to CSS</h1>
+ <h1>Welcome to CSS</h1>
- <h2 style="color: white;">Basic example</h2>
+ <h2>Basic example</h2>
```

Bueno y ahora que pensais de esta aproximacion?

- No puedo aplicar los estilos a otras paginas.
- No se puede descargar el fichero de forma asincrona.
- No puedo organizarlo en diferente carpetas o subcarpetas

Antes de eliminarlo vamos a ver como se aplica una regla a diferentes elementos:

```diff
- h1 {
- color: white
- }
- h2 {
- color: white
- }
+ h1, h2 {
+ color: white
+ }
```

Vamos a crear un nuevo fichero y añadimos los estilos que hemos creado

_./mystyle.css_

```css
body {
  background-color: brown;
}
h1,
h2 {
  color: white;
}
```

Y lo referenciamos desde la pagina:

```diff
<head>
<title>Parcel Sandbox</title>
<meta charset="UTF-8" />
- <style>
- body {
- background-color: brown;
- }
- h1,
- h2 {
- color: white;
- }
- </style>
+ <link rel="stylesheet" type="text/css" href="./mystyle.css"/>
</head>
```
