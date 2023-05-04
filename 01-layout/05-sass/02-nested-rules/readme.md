# Nested rules

Vamos a tomar como punto de partida el ejemplo anterior y ampliarlo.

Queremos que cambie el color de fondo del contenedor _div_
si pasamos el ratón por encima del contenedor.

Utilizaremos el enfoque de SASS, anidando la pseudoclase _:hover_
haciendo referencia al contexto del contenedor div.

```diff
div.container {
  padding: 15px;
  border: 1px solid black;
p {
  font-size: 125%;
}
& > p {
  font-style: italic;
  font-weight: bold;
}
+
+ &:hover {
+   background-color: khaki
+ }
}
```
