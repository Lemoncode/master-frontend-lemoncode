# Areas

Vamos a contruir un layout que contendrá las siguientes secciones:

- Header.
- Sidebar menu (left side).
- Main content.
- Footer.

Vamos a limpiar el html y partimos del siguiente:

```html
<body>
  <div class="grid-container">
    <header>Logo App</header>
    <nav>Menu</nav>
    <main>Main Menu</main>
    <footer>Footer</footer>
  </div>
</body>
```

Borramos el css e introducimos el siguiente:

```css
body {
  margin: 0;
  padding: 0;
  height: 100vh;
}
.grid-container {
  display: grid;
  height: 100%;
}
```

Para nuestro layout necesitamos 3 columna:

- Una para el menu, que ocupará unos 150px de ancho.
- Otra columan que separará el menu del contenido (ocupara 25px).
- Y por ultimo una columan que ocupará todo el ancho disponible (Usaremos las fracciones: 1fr
  para ocupar todo el espacio).

y para las filas:

- La cebacera ocupará 100px de ancho
- El contenido principal, todo el espacio disponible (1fr)
- El footer ocupará 100px de ancho.

Vamos al lio:

```diff
.grid-container {
  display: grid;
  height: 100%;
+  grid-template-columns: 150px 25px 1fr;
+  grid-template-rows: 100px 1fr 100px;
}
```

Vamos a darle color a cada una de las zonas:

```diff
.grid-container {
  display: grid;
  grid-template-columns: 150px 25px 1fr;
  grid-template-rows: 100px 1fr 100px;
}
+header {
+ background: indianred;
+ }
+
+ main {
+ background: skyblue;
+ }
+
+ nav {
+ background: goldenrod;
+ }
+
+footer {
+ background: blue;
+}
```

Bueno, esto se ve horrible... es hora de empezar a posicionar algunos items.

La cabecera ocupara toda la primera fila completa:

```diff
header {
  background: indianred;
+ grid-column: 1 / -1;
}
```

Genial ahora vamos a posicionar el contenido principal, en este caso queremos posicionarl en la line-end 3 y hasta el final:

```diff
main {
  background: skyblue;
+ grid-column: 3 / -1;
}
```

Y que podemos hacer con el footer?

```diff
footer {
  background: blue;
+ grid-column: 1 / -1;
}
```

Se ve muy bien, incluso podemos cambiar el tamaño de la ventana y podemos ver cómo el área de contenido del menú principal el área de contenido del menú principal se adapta, pero el código resultante no parece muy intuitivo... y puede ser poco mantenible (suponer que se mete una columna mas)

Vamos a probar las areas:

Añadimos la propiedad _grid-template-areas_, y definimos primero la primera area (cabecera), indicnado que ocupará 3 rows:

```diff
.grid-container {
  display: grid;
  height: 100vh;
  grid-template-columns: 150px 25px 1fr;
  grid-template-rows: 100px 1fr 100px;
+ grid-template-areas:
+    "header header header"
+    ;
}
```

Ahora definimos la fila del menu y el body. Vamos a reservar una columna para el espacio de separación (usando el caracter .) y finalmente asignamos el body al final.

```diff
.grid-container {
  display: grid;
  height: 100vh;
  grid-template-columns: 150px 25px 1fr;
  grid-template-rows: 100px 1fr 100px;
  grid-template-areas: "header header header"
+                      "menu . body";
}
```

Y para el footer hacemos lo mismo que con la cabecera:

```diff
.grid-container {
  display: grid;
  height: 100vh;
  grid-template-columns: 150px 25px 1fr;
  grid-template-rows: 100px 1fr 100px;
  grid-template-areas: "header header header"
                       "menu . body"
+                      "footer footer footer";
}
```

Ahora eliminamos el posicionamiento por numero de lineas y le damos al elemento el nombre del area al que representa:

```diff
header {
  background: indianred;
-  grid-column: 1 / -1;
+  grid-area: header;
}

main {
  background: skyblue;
-  grid-column: 3 / -1;
+ grid-area: body;
}

nav {
  background: goldenrod;
+ grid-area: menu;
}

footer {
  background: blue;
-  grid-column: 1 / -1;
+  grid-area: footer;
}

```

> A los estudiantes: Que opcion es mas mantenible?

Vamos a hacer algunos ejercicios rápidos:

- queremos pegar el menú a la derecha de la pantalla (ahora mismo está a la izquierda), ¿cómo podemos hacerlo?

- Queremos deshacernos de la sección del logo y colocarles el menú
(quitando el menú de la zona lateral).

  Comportamiento interesante: si hay un elemento con un grid-area que no aparece en el template-area, ese elemento lo pinta fuera del grid. Para que lo pinte dentro hay que eleminar el grid-area del elemento
