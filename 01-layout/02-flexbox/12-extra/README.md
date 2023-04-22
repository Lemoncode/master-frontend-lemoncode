# Extra

Vamos a hacer una galeria de imagenes.

Partimos del layout.

Añadimos las imagenes de prueba al código.

Y las añadimos al código:

```diff
<body>
  <header>Mi cabecera</header>
-  <main>Mi contenido principal</main>
+ <main>
+   <img src="./landscape-a.jpg" />
+   <img src="./landscape-b.jpg" />
+   <img src="./landscape-c.jpg" />
+   <img src="./landscape-d.jpg" />
+   <img src="./landscape-e.jpg" />
+   <img src="./landscape-f.jpg" />
+   <img src="./landscape-g.jpg" />
+   <img src="./landscape-h.jpg" />
+ </main>
  <footer>Footer</footer>
</body>

```

Vamos a darle propiedades a las imagenes:

```diff
+ img {
+    width: 150px;   
+ }
```

Ahora vemos como se comporta los img sin tener un contenedor flex. Conseguimos un efecto parecido al flex... ¿pero suficiente?

Vamos a empezar poniendo nuestro contenerdor flex:

```diff
main {
  background-color: chocolate;
  flex: 1;
+ display: flex;
}
```

Y ¿Por que se deforman? Vamos a evitarlo

``` diff
main {
  background-color: chocolate;
  flex: 1;
+ align-items: center;
}
```

Bueno vamos bien, pero el scroll nos indica que las imagenes son mas grandes que el contenedor... vamos a solucionarlo con overflow

``` diff
main {
  background-color: chocolate;
  flex: 1;
  align-items: center;
+ overflow: auto;
}
```

¿Como hacemos para que se muestren en una nueva linea?

``` diff
main {
  background-color: chocolate;
  flex: 1;
  align-items: center;
  overflow: auto;
+ flex-wrap: wrap;
}
```

Vale...y ahora vamos a darle espacio de separacion a cada elemento:

``` diff
main {
  background-color: chocolate;
  flex: 1;
  align-items: center;
  overflow: auto;
  flex-wrap: wrap;
+  gap: 5px
}
```

Y ahora centramos los elementos en el eje principal.

``` diff
main {
  background-color: chocolate;
  flex: 1;
  align-items: center;
  overflow: auto;
  flex-wrap: wrap;
  gap: 5px;
+  justify-content: center;
}
```

Y por ultimo vamos a evitar que tengamos tango espacio vacio. Para ello lo centramos en el eje secundario:

``` diff
main {
  background-color: chocolate;
  flex: 1;
  align-items: center;
  overflow: auto;
  flex-wrap: wrap;
  gap: 5px;
  justify-content: center;
+ align-content: center;
}
```