# Grid Auto Flow

Fíjate que por defecto todos los elementos que no están posicionados se colocan por filas y luego por columnas, pero ¿qué pasa si queremos que sea al revés? Esto se puede hacer con la propiedad grid-auto-flow..

Vamos a ver como funciona:

Vamos a crear un elemento y vemos que se coloca en una nueva row.

```diff
  <div id="item1" class="item">1</div>
  <div id="item2" class="item">2</div>
  <div class="item">3</div>
  <div class="item">4</div>
  <div class="item">5</div>
  <div class="item">6</div>
+ <div class="item">7</div>
```

Es porque por defecto la propiedad _grid-auto-flow_ tiene el valor por defecto de _row_

```diff
.grid-container {
  display: inline-grid;
  grid-template-columns: 100px 100px 300px;
  grid-template-rows: 100px 100px;
  border: 1px solid indianred;
+ grid-auto-flow: row;
}
```

Modificamos la propiedad _grid-auto-flow_ indicando el valor _column_ para que se creen columnas nueva en vez de filas.

```diff
.grid-container {
  display: inline-grid;
  grid-template-columns: 100px 100px 300px;
  grid-template-rows: 100px 100px;
  border: 1px solid indianred;
- grid-auto-flow: row;  
+ grid-auto-flow: column;
}
```

Este cambio de flujo sólo afecta a los elementos no posicionados, los posicionados mantienen su espacio asignado, no importa si estamos en fila o columna de grid-auto-flow
