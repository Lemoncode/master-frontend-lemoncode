# Functions

Vamos a modificar el html:

```diff
  <body>
 <div class="images-container">
      <img
        class="item-1"
        src="https://snappygoat.com/b/b483e1ebba917a4c79ce26a20066f7d43c157f71"
      />
      <img
        class="item-2"
        src="https://snappygoat.com/b/fd2a645253a50429b3964b858c8af1417044a92c"
      />
      <img
        class="item-3"
        src="https://snappygoat.com/b/9ebd31595bd0900266a1961849e3435b24def3a5"
      />
      <img
        class="item-4"
        src="https://snappygoat.com/b/3721cbff52944a58b8af1ac517e875a0f2ac9152"
      />
      <img
        class="item-5"
        src="https://snappygoat.com/b/e68fc6e703561474cc3e4383b6063b33206a2305"
      />
      <img
        class="item-6"
        src="https://snappygoat.com/b/16aa63625590ca0b06c62a53144c778139ec6a72"
      />
      <img
        class="item-7"
        src="https://snappygoat.com/b/76b13f286e789472878de2241eb9bb9b73522f40"
      />
      <img
        class="item-8"
        src="https://snappygoat.com/b/f7fc84e72acfa39604015532548137dcc16fe63e"
      />
      <img
        class="item-9"
        src="https://snappygoat.com/b/d9e9d4631842c72612da7a484d60c8680414c5b5"
      />
    </div>
  </body>

```

Ahora es turno de la hoja de estilo. Vamos a empezar con los basico:

***style.scss***

```scss
@import "base";

.images-container {
  display: grid;
  grid-template-columns: repeat(3, 200px);
  grid-template-rows: repeat(3, 200px);

  img {
    width: 200px;
    height: 200px;
  }
}
```

Vamos a darle un efecto a la imagen, para ello definimos una funcion y se la aplicamos al hover

***style.scss***

```diff
@import "base";

+ @function filter-image($amount) {
+  @return brightness($amount * 2) sepia($amount);
+ }

.images-container {
  display: grid;
  grid-template-columns: repeat(3, 200px);
  grid-template-rows: repeat(3, 200px);

  img {
    width: 200px;
    height: 200px;
  }

+  img:hover {
+    filter: filter-image(0.6);
+  }

}
```

Y ahora mas dificil todavía, vamos a aplicarle un brillo dependiendo de la posicion que ocupe la imagen:

***style.scss***

```diff
@import "base";

@function filter-image($amount) {
  @return brightness($amount * 2) sepia($amount);
}

.images-container {
  display: grid;
  grid-template-columns: repeat(3, 200px);
  grid-template-rows: repeat(3, 200px);

  img {
    width: 200px;
    height: 200px;
  }

-  img:hover {
-    filter: filter-image(0.6);
-  }

+  $i: 1;
+  @while $i <= 9 {
+    .item-#{$i}:hover {
+      filter: filter-image(0.6 * $i);
+    }
+    $i: $i + 1;
+  }

}
```
