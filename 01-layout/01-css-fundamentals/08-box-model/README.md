# Box model

Para ver el modelo de caja al ccompleto vamos a realizar los siguientes cambios:

```diff
body {
  border: solid red;
  font-family: "Raleway", sans-serif;
}
div {
  margin:40px;
  font-size: 40px;
-  border: inherit;
+  border: 5px solid red;
+  padding: 20px;
}
```

Pero si ponemos un width de 300, ¿Cuanto será el tamaño del elemento?

```diff
body {
  border: solid red;
  font-family: "Raleway", sans-serif;
}
div {
  margin:40px;
  font-size: 40px;
  border: inherit;
  border: 5px solid red;
  padding: 20px;
+  width: 300px;
}
```

Son 350px (la suma de 300 + 2 * padding + 2 * borde). ¿Como podemos evitar esto? cambiando la propiedad _box-sizing_

```diff
body {
  border: solid red;
  font-family: "Raleway", sans-serif;
}
div {
  margin:40px;
  font-size: 40px;
  border: inherit;
  border: 5px solid red;
  padding: 20px;
  width: 300px;
+ box-sizing: border-box;
}
```

Por defecto es content-box. Hay librerias que hacen esto por nosotros.