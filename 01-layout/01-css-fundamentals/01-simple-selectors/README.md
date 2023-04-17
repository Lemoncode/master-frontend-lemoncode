# Simple Selectors

Vamos a jugar con los selectores simples.

Vamos a añadir tres elementos nuevos:

```diff
  <body>
+   <div id="app">
      <h1>Welcome to CSS</h1>
      <h2>Basic example</h2>
+     <div class="title">Hey I'm a title</div>
+     <div id="myid">Hello from id myid</div>
+   </div>
  </body>
```

Vamos a darle estilos a los div.

Podriamos estar tentados a darle el estilo al elemento _div_ pero que pasa? Vamos a probarlo:

```diff
body {
  background-color: brown;
}
h1,
h2 {
  color: white;
}
+div {
+ background-color: blue;
+}
```

Vamos a cambiar el estilo a uno basado en clases:

```diff
body {
  background-color: brown;
}
h1,
h2 {
  color: white;
}
-div {
- background-color: blue;
-}

+ .title {
+ color: blue;
+ font-size: 500%;
+ }
```

Y ahora le aplicamos estilo al elemento con Id _myId_

```diff
.title {
color: blue;
font-size: 500%;
}
+ #myid {
+ margin: 25px;
+ }
```

Podemos ver que cada div tiene su propio estilo.

Que limitacion tenemos con aplicar los estilos por ID?

- En teoria, de esta forma solo podemos usar una vez pero con la clase podemos usar varias veces.

Podemos aplicar _class_ _title_ al elemento _h1_?

```diff
<body>
<div id="app">
- <h1>Welcome to CSS</h1>
+ <h1 class="title">Welcome to CSS</h1>
<h2>Basic example</h2>
<div class="title">Hey I'm a title</div>
```

Ahora tenemos conflictos:

- Tenemos un selector para _h1_ donde establece el color de la fuente a blanco.
- Tenemos una clase que establece el color de la fuente a azul.

Que pasa si le añadimos al selector _h1_ la propiedad _background-color: yellow_.

Tenemos que por un lado hay conflicto y por otro se mezclan estilos, eso es en esencia el Cascading Style Sheets:

- Primero se aplica los estilos del selector _h1_.
- Y luego se aplica el estilo de la clase (sobreescribiendo las propiedas con conflictos)

En este caso para evitar el conflicto se podría hacer mas especifico el selector. Podemos aplicar la regla solo a los elementos div con esa clase especifica.

```diff
- .title {
+ div.title {
color: blue;
font-size: 500%;
}
```

Al hacer esto se esta indicnado que todos los div que contengan la clase _title_ usaran esta regla. Podemo ver que se aplica al _div_, pero no al _h1_
