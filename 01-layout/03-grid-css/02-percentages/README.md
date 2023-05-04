# Percentages

Vamos a jugar con los valores relativos.

En este caso vamos a indicar que la tercera columna tomará todo el espacio disponible, y el resto tomará unos valores concretos (en pixel).

Y por las filas, vamos a darle a la primera el 25% de espacio disponible, y a la ultima que tome el resto de espacio disponible.

```diff
.grid-container {
  display: grid;
-  grid-template-columns: 100px 100px 300px;
+  grid-template-columns: 40px 50px auto 50px 40px;
-  grid-template-rows: 100px 100px;
+  grid-template-rows: 25% 100px auto;
}
```

Vamos a añadir mas grid items:

```diff
    <div class="grid-container">
      <div class="item">1</div>
      <div class="item">2</div>
      <div class="item">3</div>
      <div class="item">4</div>
      <div class="item">5</div>
      <div class="item">6</div>
+      <div class="item">7</div>
+      <div class="item">8</div>
+      <div class="item">9</div>
+      <div class="item">10</div>
+      <div class="item">11</div>
+      <div class="item">12</div>
+      <div class="item">13</div>
+      <div class="item">14</div>
    </div>
```

Y vamos a ponerle un borde a cada item

```css
.item {
  border: 2px solid red;
}
```

Vamos a modificar un poco el contenedor, le añadimos borde y le damos mas alto:

```diff
.grid-container {
  display: grid;
  grid-template-columns: 40px 50px auto 50px 40px;
  grid-template-rows: 25% 100px auto;
+  border: 2px solid blue;
+  height: 100vh;
}
```

Si queremos eliminar el scroll, ¿qué tenemos que hacer?.

Primero vamos a eliminar el margin y el padding del body.

```diff
+ body {
+   margin: 0;
+   padding: 0;
+ }
```

Y luego usaremos el box-sizing para no tener en cuenta el border en el ancho del elemento.

```diff
.grid-container {
+ box-sizing: border-box;
  display: grid;
  grid-template-columns: 40px 50px auto 50px 40px;
  grid-template-rows: 25% 100px auto;
  border: 2px solid blue;
  height: 100vh;
}
```
