# Justify content

Ahora es el momento de aprender a justificar todos los elementos relativos al contenedor espacio.

Actualicemos la plantilla de cuadrícula que hemos creado para que todas las columnas tengan un ancho limitado (al hacer esto tendremos algo de espacio libre en nuestro contenedor de rejilla):

```diff
.grid-container {
  display: grid;
- grid-template: repeat(2, 1fr) / repeat(3, 1fr);
+ grid-template: repeat(2, 100px) / repeat(3, 100px);
  border: 1px solid black;
  justify-items: start;
  align-items: center;
}
```

Para visualizarlo mejor vamos a introducir un padding de 25 pixels a cada items.

```diff
.item {
  border: 1px solid black;
  background-color: khaki;
  display: flex;
  justify-content: center;
+ padding: 25px;
}
```

Y vamos a eliminar los estilos de item2 del ejemplo anterior para limpiar un poco el resultado

```diff
#item2 {
- align-self: start;
}
```

Vamos a mover los elementos a la partes derecha:

```diff
.grid-container {
  display: grid;
  grid-template: repeat(2, 100px) / repeat(3, 100px);
  border: 1px solid black;
  justify-items: start;
  align-items: center;
+ justify-content: end;
}
```

Probamos con _center_ y _space-between_

Puedes probar y comprobar el comportamiento del resto de valores.
