# Inline Grid

Vamos a dejar el grid en el estado original:

```css
.grid-container {
  display: grid;
  grid-template-columns: 100px 100px 300px;
  grid-template-rows: 100px 100px;
}
```

Eliminamos los estilos que le hemos dados al item1 y item2:

```diff
- #item1 {
-  grid-column: line2 / end;
-  grid-row-start: 1;
-  grid-row-end: 2;
- }

-#item2 {
-  grid-column-start: 2;
-  grid-column-end: 3;
-  grid-row-start: 1;
-  grid-row-end: 2;
-  background: khaki;
-}
```

Ahora añadimos un border al contenedor:

```diff
.grid-container {
  display: grid;
  grid-template-columns: 100px 100px 300px;
  grid-template-rows: 100px 100px;
+  border: 5px solid indianred;
}
```

Si te fijas, el grid llega hasta el final del ancho de la ventana, pero los elementos ocupan menos espacio. ¿por qué? Porque le hemos pedido al grid que coja todo el ancho disponible pero sus elementos necesitan menos espacio para ser mostrados, esto puede ser genial si queremos centar/justificar los elementos.

Qué pasaría si cambiamos el estilo del grid a inline?

```diff
.grid-container {
-  display: grid;
+  display: inline-grid;
  grid-template-columns: 100px 100px 300px;
  grid-template-rows: 100px 100px;
  border: 5px solid indianred;
}
```

Ahora el grid solo ocupa exactamente el ancho solicitado por los elementos mostrados.

Vamos a probar con fr o auto:

```diff
.grid-container {
  display: grid;
- grid-template-columns: 100px 100px 300px;
+ grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 100px 100px;
  border: 5px solid indianred;
}
```
