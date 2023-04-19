# Inheritance

Ahora toca jugar con la herencia. Partimos de este _html_:

```html
<body>
  <div>
    I'm the div :)
    <p>
      A paragraph inside a div
      <em>emphasis</em>
      <strong>strong</strong>
    </p>
  </div>
</body>
```

Eliminamos todo los estilos definidos, menos la fuente de letra:

```diff
@import "https://fonts.googleapis.com/css2?family=Raleway:wght@400&disp";
body {
  font-family: "Raleway", sans-serif;
}

- div p {
- background-color: chocolate;
- }
-
- p {
- background-color: green;
- font-size: 40px;
- }
-
- p {
- background-color: grey;
- }
```

Como podemos ver, por defecto se aplica las propiedades del user agent y la fuente definida properties y la fuente definida en el elemento _body_ es heredad para todos los hijos.

Que pasaría si añadimos un border al elemento body :

```diff
body {
+ border: solid red;
  font-family: "Raleway", sans-serif;
}
```

El border solo se aplica al body pero no es heredado en los elmentos hijos.

Podríamos modificar la fuente de letra dentro de los divs a 40px:

```diff
body {
  border: solid red;
    font-family: "Raleway", sans-serif;
  }

+  div {
+    font-size: 40px;
+  }
```

Podemos ver en las dev tools que el parrafo obtiene la fuente de letra de body y el tamaño del div.

Ok, vamos a indicar que todos los parrafos que estan dentro del div deberian usar el tamaño de fuente initial:

```diff
body {
border: solid red;
  font-family: "Raleway", sans-serif;
}

div {
  font-size: 40px;
}

+ div p {
+ font-size: initial;
+ }
```

Para terminar, algo interesante, podemos pedirle a una propiedad que herede aunque por defecto no lo haga, por ejemplo podemos probarlo con la propiedad border:

```diff
body {
  border: solid red;
  font-family: "Raleway", sans-serif;
}
div {
+ margin:40px;
+ border: inherit;
  font-size: 40px;
}
```
