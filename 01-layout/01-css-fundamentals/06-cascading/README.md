# Cascading

Vamos a ver las propiedades en cascada, la precedencia y la especificidad.

Partimos de este _html_:

```html
<body>
  <h1>Heading 1</h1>
  <h2>Heading 2</h2>
  <div>A div</div>
  <div>
    <p>A paragraph inside a div</p>
  </div>
  <p>Another paragraph</p>
</body>
```

Antes de empezar, vamos a importar una fuente y aplicar como fuente por defecto (la aplicamos en el body de la pagina):

```css
@import "https://fonts.googleapis.com/css2?family=Raleway:wght@400&disp";

body {
  font-family: "Raleway", sans-serif;
}
```

Le damos un estilo a los parrafos:

```css
p {
  background-color: green;
}
```

Genial, todos los parrafos se muestra con el color de fondo verde, pero vamos a añadir otra regla:

```diff
p {
background-color: green;
}

+ p {
+ background-color: grey;
+}
```

Oops.. por qué se muestran gris ? .... la ultima regla gana.

Pero que pasa si introducimos esta regla:

```diff
+ div p {
+   background-color: chocolate;
+ }

p {
  background-color: green;
}
p {
  background-color: grey;
}
```

Esta regla es mas especifica (tenemos dos selectores), y gana a las otras dos reglas.

Podemos abrir las dev tools y comporbar el resultado con detalle...
(F12, elegimos el elemento y vemos la barra de estilos).

Que pasaría si añadimos una fuente de letra de 40px en el estilo de parrafo
que han sido ignorado:

```diff
div p {
  background-color: chocolate;
}

p {
  background-color: green;
+ font-size: 40px;
}

p {
  background-color: grey;
}
```

La fuente de letra se aplica a todos los parrafos. Por que? el otro selectos sobreescribe las propiedades (en este caso el color de fondo) pero si una propiedad no es definida no se sobreescribe.
