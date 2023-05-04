# Rem-em

Cuando ponemos valores usando rem y em lo hacemos relativo 

```html
<div class="container">
    <p class="p-em">Parrafo con em</p>
    <p class="p-rem">Parrafo con rem</p>
</div>
```

Vamos con el css

```css
html {
    font-size: 10px;
}
```

Ahora le damos el valor de font-size al contenedor

```diff
html {
    font-size: 10px;
}

+ .container {
+   font-size: 30px
+ }
```

Le ha afectado a los dos parrafos. Ahora le damos valor a los p.

```diff
html {
    font-size: 10px;
}

.container {
   font-size: 30px
}

+.p-rem {
+    font-size: 1rem;
+}

+.p-em {
+    font-size: 1em;
+}
```

Y esta unidad la podemos utilizar con cualquier medida

```diff
html {
    font-size: 10px;
}

.container {
   font-size: 30px
}

+.container p {
+    border: 2px solid red;
+}

.p-rem {
    font-size: 1rem;
+   padding: 1rem;
}

.p-em {
    font-size: 1em;
+   padding: 1em;
}
```

Lo que conseguimos es que cambiando el html modificamos toda la web.

```diff
html {
    font-size: 10px;
}

.container {
-   font-size: 30px;
+   font-size: 3rem;
}

.container p {
   border: 2px solid red;
}

.p-rem {
   font-size: 1rem;
   padding: 1rem;
}

.p-em {
   font-size: 1em;
   padding: 1em;
}

+ @media screen and (max-width: 300) {
+   html {
+       font-size: 20px;
+   }
+ }
```

Pero es mejor utilizar variables

```diff
html {
    font-size: 10px;
+   --space-sm: 5px;
}

.container {
-   font-size: 30px;
+   font-size: 3rem;
}

.container p {
   border: 2px solid red;
}

.p-rem {
   font-size: 1rem;
-  padding: 1rem;
+  padding: var(--space-sm)
}

.p-em {
   font-size: 1em;
-  padding: 1em;
+  padding: var(--space-sm)
}

@media screen and (max-width: 300) {
  html {
      font-size: 20px;
+     --space-sm: 10px;
  }
}
```
