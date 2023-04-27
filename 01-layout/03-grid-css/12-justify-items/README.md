# Justify items

Es hora de jugar con los elementos de justificación, como dijimos antes esto nos recordará mucho a la propiedad de contenido justify de Flexbox.

Vamos a crear un ejemplo con este html y css.

```diff
<body>
+ <div class="center-container grid-container">
+   <div class="item">1</div>
+   <div class="item">2</div>
+   <div class="item">3</div>
+   <div class="item">4</div>
+   <div class="item">5</div>
+   <div class="item">6</div>
+ </div>
</body>
```

```css
body {
  background-color: darkslategrey;
  padding: 0;
  margin: 0;
  height: 100vh;
  width: 100vw;
}
```

Sólo para tener una visión clara de lo que está sucediendo vamos a centrar el contenedor (esto es sólo HTML genérico no relacionado con CSS Grid):

```diff
body {
  background-color: darkslategrey;
  padding: 0;
  margin: 0;
  height: 100vh;
  width: 100vw;
}

+ .center-container {
+   position: relative;
+   background-color: white;
+   width: 80vw;
+   height: 80vh;
+   left: 10vw;
+   top: 5vw;
+ }
```

Ahora vamos a centrarnos en el contenedor de la rejilla CSS, vamos a definir una rejilla CSS que contendrá tres columnas:

```css
.grid-container {
  display: grid;
  grid-template: repeat(2, 1fr) / repeat(3, 1fr);
  border: 1px solid black;
}
```

Vamos a definir el estilo para todos los items, serán como un contenedor flexbox sólo para obtener todo el espacio y centrar el contenido:

```css
.item {
  border: 1px solid black;
  background-color: khaki;
  display: flex;
  justify-content: center;
  align-items: center;
}
```

Es tiempo de jugar con la propiedad de justify en el CSS Grid, por defecto el valor es _strech_

```diff
.grid-container {
  display: grid;
  grid-template: repeat(2, 1fr) / repeat(3, 1fr);
  border: 1px solid black;
+ justify-items: strech;
}
```

Vamos a modificarla:

```diff
.grid-container {
  display: grid;
  grid-template: repeat(2, 1fr) / repeat(3, 1fr);
  border: 1px solid black;
- justify-items: strech;
+ justify-items: start;
}
```

Vamos cambiando a _end_ y a _center_ y comprobamos su comportamiento.

Podemos indicar que un determinado item tiene un comportamiento diferente al espedificado en justify-items:

```diff
<div class="center-container grid-container">
<div class="item">1</div>
- <div class="item">2</div>
+ <div class="item" id="item2">2</div>
<div class="item">3</div>
```

```diff
.item {
  border: 1px solid black;
  background-color: khaki;
  display: flex;
  justify-content: center;
  align-items: center;
}

+ #item2 {
+  justify-self: start;
+ }
```
