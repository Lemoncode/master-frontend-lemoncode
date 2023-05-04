# Media queries

Vamos a ver con un ejemplo como se puede usar las medias query

Añadimos un link con el fichero css por defecto:

```diff
  <head>
    <title>Parcel Sandbox</title>
    <meta charset="UTF-8" />
+    <link rel="stylesheet" href="./src/styles.css" />
  </head>
```

Y el siguiente contenido _html_:

```diff
<body>
+ <header>CSS Training</header>
+ <div class="grid-container">
+   <div class="item">1</div>
+   <div class="item item-2">2</div>
+   <div class="item">3</div>
+   <div class="item">4</div>
+   <div class="item">5</div>
+   <div class="item">6</div>
+ </div>
</body>
```

Asi que tenemos:

- Un contenedor grid.
- Una series de elementos, y a uno de ellos le hemos añadido una clase extra para identificarlo (item-2)

Es tiempo de añadir los estilos:

- Eliminamos los margins del body.
- Añadimos un grid container de 3 columnas y 2 filas.
- Damos estilos a la cabecera.
- Añadimos estilos a cada uno de los elementos.

```css
body {
  padding: 0;
  margin: 0;
  font-family: sans-serif;
}
.grid-container {
  display: grid;
  background-color: darkslategrey;
  gap: 1rem;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}
header {
  height: 150px;
  background-color: indianred;
  padding: 25px;
  font-size: 150%;
}
.item {
  background-color: khaki;
  padding: 25px;
}
```

> Tenga en cuenta que siempre estamos eliminando los márgenes del cuerpo sólo para obtener una apariencia consistente en todos los navegadores, en un proyecto real haríamos uso de una biblioteca como ress: https://github.com/filipelinhares/ress

Antes de ir a la media queries,  vamos a refrescar nuestros conocimientos sobre flexbox,
¿Qué pasa si quiero que el grid-container tome todo el espacio disponible del viewport?
Puedo definir el elemento _body_ element como un contenedor flex y darle _grid-container_ la propiedad _flex_ el valor de 1:

```diff
body {
  padding: 0;
  margin: 0;
+ display: flex;
+ height: 100vh;
+ flex-direction: column;
}
.grid-container {
+ flex-grow: 1;
  display: grid;
  background-color: darkslategrey;
  gap: 1rem;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}
```

Ok, ahora si el usuario va a navegar por nuestra aplicación en un dispositivo de tableta
queremos tener suficiente espacio para mostrar el contenido, pero no hacer scroll horizontal,
así que en lugar de tener 3 columnas, vamos a mostrar sólo 2, ¿cómo puedo hacer esto?
Media queries al rescate:

- Es hora de empezar por mobile first.
- Vamos a añaidr una media query que se aplicará para resoluciones inferiores a 650px.

```diff
.grid-container {
  flex-grow: 1;
  display: grid;
  background-color: darkslategrey;
  gap: 1rem;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}

+ @media screen and (max-width: 650px) {
+   .grid-container {
+     grid-template-columns: 1fr 1fr;
+     grid-template-rows: 1fr 1fr 1fr;
+   }
+ }
```

Ahora podemos hacer una prueba y comprobar que si reducimos nuestra ventana habrá un momento en el que la disposición del grid cambie de tres a
dos columnas.

Podríamos guardar el espacio de la cabecera para esta pequeña resolución:

```diff
@media screen and (max-width: 650px) {
  .grid-container {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr;
  }

+ header {
+   height: initial;
+ }
}
```

Un tema interesante es que sólo tenemos que indicar las
propiedades que cambian, el resto se heredará.

¿Qué pasa con los dispositivos móviles? Sólo queremos tener una sola columna en este caso, vamos a por ello:

```diff
@media screen and (max-width: 650px) {
  .grid-container {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr;
  }
  header {
    height: initial;
  }
}

+ @media screen and (max-width: 450px) {
+ .grid-container {
+ grid-template-columns: 1fr;
+ grid-auto-rows: 1fr;
+ }
+
+ header {
+ display: none;
+ }
+}
```

Tal y como hemos colocado las media queries, podemos encontrarnos con un problema, el orden.

Vamos a colocar la última media query de 450px y ponerla encima de la de 650px.

```diff
.item {
  background-color: khaki;
  padding: 25px;
}
+ @media screen and (max-width: 450px) {
+ .grid-container {
+ grid-template-columns: 1fr;
+ grid-auto-rows: 1fr;
+ }
+
+ header {
+ display: none;
+ }
+ }

@media screen and (max-width: 650px) {
  .grid-container {
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
}

header {
  height: initial;
}
}

- @media screen and (max-width: 450px) {
- .grid-container {
- grid-template-columns: 1fr;
- grid-auto-rows: 1fr;
- }
-
- header {
- display: none;
- }
```

Si lo intentamos podemos encontrarlo:

- Para la resolucion de escritorio funciona bien.
- Para una resolución de tablet obtenemos el resultado esperado.
- Miramos para la resolucion de movil... ouch ! Hay dos columnas :(,
  que ha pasado?

> Discursion

El problema es que el max-width 650 cumple con la resolución de movil y como es el último en definirse es el ganador.

Una solución a este problema es añadir una condición previa:

```diff
- @media screen and (max-width: 650px) {
+ @media screen and (min-width: 451px) and (max-width: 650px) {
   .grid-container {
      grid-template-columns: 1fr 1fr;
```

# Ejemplos con Areas

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <div class="grid-container">
      <header>Logo App</header>
      <nav>Menu</nav>
      <main>Main Menu</main>
      <footer>Footer</footer>
    </div>
  </body>
</html>
```

```css
body {
  padding: 0;
  margin: 0;
  font-family: sans-serif;
}

.grid-container {
  display: grid;
  height: 100vh;
  grid-template-columns: 150px 25px 1fr;
  grid-template-rows: 100px 1fr 100px;
  grid-template-areas: "header header header"
                       "menu . body"
                       "footer footer footer";
}

header {
  background: indianred;
  grid-area: header;
}

main {
  background: skyblue;
 grid-area: body;
}

nav {
background: goldenrod;
 grid-area: menu;
}

footer {
  background: blue;
  grid-area: footer;
}

@media screen and (max-width: 650px) {
    .grid-container {
      grid-template-columns: 1fr 1fr;
      grid-template-areas: 
        "header header"
        "menu body"
        "footer footer";
    }
}

 @media screen and (max-width: 450px) {
   .grid-container {
   grid-template-columns: 1fr;
   grid-template-rows: 100px 250px 1fr 100px;;
   grid-template-areas: 
   "header"
   "menu"
   "body"
   "footer";
   }
  }
```
