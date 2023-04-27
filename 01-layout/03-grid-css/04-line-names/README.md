# Line names

Las lineas de separacion, que normalmente se llaman: 1, 2, 3 (or -3 -2 -1), pueden ser renombradas.

En algunos escenarios esto puede hacer mas facil que posicionemos los items. Para hacerlos, ponemos el nombre estre corchetes antes o despues de cada fila o columna, por ejemplo:

```diff
.grid-container {
-  grid-template-rows: 100px 100px;
+  grid-template-rows: [row1-start]100px[row1-end]100px[lastline];
-  grid-template-columns: 1fr 2fr 1fr;
+  grid-template-columns: [first]1fr[line2]2fr[line3]1fr[end];
}
```

No es buena idea añadir el nombre por todas partes, porque lo hará que el codigo sea menos legible. Solo hay que añadirlo en los sitios mas importantes.

Otra opción que tenemos disponible es utilizar más de un alias para identificar uno de los separadores de línea, algo así como:

```diff
.container: {
- grid-template-rows: [row1-start]100px[row1-end]100px[lastline];
+  grid-template-rows: [row1-start]100px[row1-end row2-start]100px[lastline];
}
```

Sólo hay que utilizarlo en determinados escenarios, normalmente nuestro código acaba siendo un poco
desordenado.
