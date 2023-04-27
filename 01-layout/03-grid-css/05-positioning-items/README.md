# Positioning Items

Vamos a añadirle identificador a nuestro primer item:

```diff
<body>
  <div class="grid-container">
-   <div class="item">1</div>
+   <div class="item" id="item1">1</div>
    <div class="item">2</div>
```

Vamos a darle estilos al item1 y posicionarlo en el grid:

```css
#item1 {
  grid-column-start: 1;
  grid-column-end: 2;
  grid-row-start: 1;
  grid-row-end: 2;
}
```

Y... tenemos el mismo resultado...Que pasa?
Pues que hemos mantenido la misma posicion que el css grid le asigna al item 1 de forma automatica (tenemos elementos posicionados y elementos no posicionados, en este segundo caso CSS Grid decide donde
colocarlos);

Vamos a modificar grid-column-end a 3

```diff
#item1 {
grid-column-start: 1;
- grid-column-end: 2;
+ grid-column-end: 3;
grid-row-start: 1;
grid-row-end: 2;
}
```

Ese Item1 toma ahora dos columans y el resto de los items no posicionados se desplazan.

Vamos a ver los conflictos... Que pasaria si intentamos hacer que el item1 ocupe la posicion del item 2? Podemos pensar en varias alternativas:

- El elemento 1 ocupa la posicion del elemento 2 y se muestran uno encima del otro.
- El elemento 2 se desplaza hacia la izquierda dejando el hueco al 1 cuando se posiciona.
- El elemento 2 se desplaza hacia la derecha y queda un hueco donde estaba el elemento 1.

Css-grid es muy inteligente y posiciona el elemento2 donde estaba el 1, es decir coloca los elementos no posicionados en el orden de huecos libres que tiene.

Vamos a ver el ejemplo en accion

```diff
#item1 {
- grid-column-start: 1;
+ grid-column-start: 2;
  grid-column-end: 3;
  grid-row-start: 1;
  grid-row-end: 2;
  background: khaki;
}
```

Lo que hace CSS Grid es:

- Tu defines una cuadricula
- Me dices que elemento se posiciona y yo los coloco en su sitio.
- Y el resto los voy colocando a medida que encuentro espacios libres.

Es poco usuarl colocar dos elementos en la misma posicion, en este caso se colocan uno encima de otro

```diff
<body>
  <div class="grid-container">
    <div class="item" id="item1">1</div>
-   <div class="item">2</div>
+   <div class="item" id="item2">2</div>
```

```diff
#item2 {
+  grid-column-start: 2;
+  grid-column-end: 3;
+  grid-row-start: 1;
+  grid-row-end: 2;
+  background: khaki;
}
```

Y se puede seleccionar el que se visualiza modificando el z-index

```diff
#item1 {
 grid-column-start: 1;
 grid-column-start: 2;
 grid-column-end: 3;
 grid-row-start: 1;
 grid-row-end: 2;
 background: khaki;
+ z-index: 999;
}
```

También podemos utilizar columnas con nombre, por ejemplo:

```diff
#item1 {
- grid-column-start: 2;
+ grid-column-start: line2;
  grid-column-end: 3;
  grid-row-start: 1;
  grid-row-end: 2;
  background: khaki;
}
```

Vamos modificar la posicion de item utilizando otro nombre de columna:

```diff
#item1 {
- grid-column-start: line2;
+ grid-column-start: first;
-  grid-column-end: 3;
+  grid-column-end: end;
  grid-row-start: 1;
  grid-row-end: 2;
  background: khaki;
}
```

Tambien existe un shorhand para el posicionamiento:

```diff
#item1 {
- grid-column-start: first;
-  grid-column-end: end;
+  grid-column: first / end;
  grid-row-start: 1;
  grid-row-end: 2;
  background: khaki;
}
```

Ahora con span

```diff
#item1 {
-  grid-column: first / end;
+  grid-column: first / span 3;
  grid-row-start: 1;
  grid-row-end: 2;
  background: khaki;
}
```

Y que pasaría si hago esto?

```diff
#item1 {
-  grid-column: first / span 3;
+  grid-column: first / span 4;
  grid-row-start: 1;
  grid-row-end: 2;
  background: khaki;
}
```
