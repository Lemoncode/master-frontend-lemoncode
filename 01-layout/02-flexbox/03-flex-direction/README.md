# Flex direction

Vamos a jugar con la propiedad _flex-direction_

Borramos nuestro HTML y creamos el siguiente contenido:

```diff
<body>
+ <div>
+   <div>
+     <h1>Element 1</h1>
+   </div>
+   <div>
+     <h1>Element 2</h1>
+   </div>
+   <div>
+     <h1>Element 3</h1>
+   </div>
+ </div>
</body>
```

Vamos a añadir una clase a el div contenedor, y la usaremos para definer nuestro flex container.

```diff
<body>
- <div>
+ <div class="my-flex-container">
<div>
<h1>Elemento 1</h1>
```

Para simplificar un poco, vamos a eliminar el margen y el padding del body:

```css
body {
  font-family: sans-serif;
  margin: 0px;
  padding: 0px;
}
```

Para distinguir mejor cada elemento vamos a añadir algún color de fondo
a cada elemento (esto no está relacionado con flexbox, es simplemente
CSS genérico):

The first element

```diff
body {
  font-family: sans-serif;
  margin: 0px;
  padding: 0px;
}

+ .my-flex-container div:nth-child(1) {
+ background-color: darkmagenta;
+ }
```

Segundo y tercero:

```diff
body {
  margin: 0px;
  padding: 0px;
}
.my-flex-container div:nth-child(1) {
  background-color: darkmagenta;
}

+ .my-flex-container div:nth-child(2) {
+ background-color: darkolivegreen;
+ }
+ .my-flex-container div:nth-child(3) {
+ background-color: darkred;
+ }
```

Ahora establecemos a todos los div un color de letra blanco e inclumos 5 pixel de padding.

```diff
body {
margin: 0px;
padding: 0px;
}

...

+ .my-flex-container div {
+ padding: 5px;
+ color: white;
+ }
```
Vale, esto pinta bien, pero no estamos usando flexbox todavía...solo tenemos 3 div que por defecto usan display _block_ y cada uno intenta coger todo el espacio horizontal disponible.

Tiempo de empezar a jugar con flexbox :)

Vamos a convertir nuetro contanedor en un contenedor flex:
  - Indicamos que el _display_ del contenedor es _flex_
  - Por defecto _flex-direction_ es _row_ (No necesitamos definirlo), pero en el ejemplo lo ponemos para poder jugar luego con el.

```diff
body {
  margin: 0px;
  padding: 0px;
}

+ .my-flex-container {
+ display: flex;
+ flex-direction: row;
+ }
```

Ahora todos los elementos se muestran en una fila.

Para saber cuanto espacio esta ocupando el contenedor vamos a añadir un border:

```diff
.my-flex-container {
+ border: 5px solid black;
  display: flex;
  flex-direction: row;
}
```

Comprobamos que el contenador ocupa el 100% del ancho disponible y que los items solo ocupan el ancho que necesitan para mostrar su contenido.

Que pasaría si queremos mostrar los item en columnas en vez de en fila? solo necesitamos cambiar la propiedad flex-direction a columna:

```diff
.my-flex-container {
  border: 5px solid black;
  display: flex;
- flex-direction: row;
+ flex-direction: column;
}
```

Seguimos jugando con la propiedad de flex-direction.

Y si queremos colocar los elementos en fila pero de derecha a izquierda? Podemos conseguirlo con el row-reverse:

```diff
.my-flex-container {
  border: 5px solid black;
  display: flex;
- flex-direction: column;
+ flex-direction: row-reverse;
}
```

Y tenemos el mismo comportamiento para las columnas con el valor _column-reverse_

```diff
.my-flex-container {
border: 5px solid black;
display: flex;
- flex-direction: row-reverse;
+ flex-direction: column-reverse;
}
```