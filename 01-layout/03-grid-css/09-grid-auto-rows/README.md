# Grid Auto Rows

En los ejemplos anteriores, vimos que definimos, 2 filas y al final añadimos una tercera fila, que se creó sobre la marcha, pero no teníamos control sobre la altura de la nueva fila creada..

Vamos a eliminar la propiedad _grid-auto-flow_

```diff
.grid-container {
  display: grid;
  grid-template-columns: 100px 100px 300px;
  grid-template-rows: 100px 100px;
  border: 5px solid indianred;
-  grid-auto-flow: column;
}
```

La nueva fila que se ha creado automaticamente para el elemento 7 tiene un alto un poco extraño.

Vamos a ver como podemos solucionar esto:

```diff
.grid-container {
  display: grid;
  grid-template-columns: 100px 100px 300px;
  grid-template-rows: 100px 100px;
  border: 5px solid indianred;
+ grid-auto-rows: 100px;
}
```

Es mas podríamos borrar el grid-template-rows porque los elementos definidos en el template tienen el mismo tamaño:

```diff
.grid-container {
  display: grid;
  grid-template-columns: 100px 100px 300px;
- grid-template-rows: 100px 100px;
  border: 5px solid indianred;
+ grid-auto-rows: 100px;
}
```

Hacer el ejemplo con  grid-auto-flow: column;
