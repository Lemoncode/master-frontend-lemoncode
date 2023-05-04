# Media

Vamos a crear las reglas de medias query dentro de nuestra hoja de estilo

***style.scss***

```diff
@import "base";

.grid-container {
  display: grid;

+  @media screen and (min-width: 800px) {
+    grid-template-columns: repeat(4, 200px);
+    grid-template-rows: repeat(2, 200px);
+  }

+  @media screen and (max-width: 800px) {
+    grid-template-columns: repeat(2, 200px);
+    grid-template-rows: repeat(4, 200px);
+  }

+  @media screen and (max-width: 400px) {
+    grid-template-columns: repeat(1, 200px);
+    grid-template-rows: repeat(8, 200px);
+  }
```
