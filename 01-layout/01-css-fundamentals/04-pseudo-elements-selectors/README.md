# Pseudo elements selectors

Vamos a practicar con los pseudo elementos. Partimos del siguiente _html_:

```diff
<body>
- <h1>Heading</h1>
- <input type="text" />
- <div class="container">
- <div>Primer elemento</div>
- <div>Segundo elemento</div>
- <div>Tercer elemento</div>
- <div>Cuarto elemento</div>
- </div>
+ <h1>Heading</h1>
+ <p>
+Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
scelerisque turpis ac libero rutrum vestibulum. Donec aliquet semper lacus
eleifend facilisis. Donec elementum lacus lectus, vitae porttitor eros
lobortis eu. Proin mollis a arcu sed interdum. Vestibulum id hendrerit
eros. Nunc quis vehicula metus. Sed ac vehicula magna. Mauris ut gravida
diam. Curabitur semper consectetur libero, sed efficitur nisl molestie in.
Fusce at erat in felis eleifend suscipit non sit amet leo. In dapibus at
justo sed facilisis. Mauris placerat malesuada turpis vitae semper.
Integer vehicula dolor risus, a blandit nisi commodo sed. Aenean finibus
nunc non ultricies ultricies. Curabitur eu cursus dui, ut fermentum nibh.
+ </p>
+ <div class="myclass">Lemoncode</div>
</body>
```

Borramos todo el contenido css.

Vamos a jugar con el parrafo, queremos que la primera letra del parrafo sea mas grande:

```css
p::first-letter {
  font-size: 350%;
}
```

Ahora, vamos a jugar con el texto seleccionado en el parrafo, podemos cambiar el color de la seleccion:

```diff
p::first-letter {
font-size: 350%;
}
+ p::selection {
+ background-color: darkorange;
+ color: white;
+ }
```

Ademas podríamos añadir algun texto al final del parrafo:

```diff
- p::selection {
- background-color: darkorange;
- color: white;
- }
+ p:after {
+ content: "... [More info]";
+ cursor: pointer;
+ }
```

Vamos a hacer otro ejemplo sobre el _div_ que contiene Lemoncode, queremos añadir el simbolo de copyright a la derecha de la marca _Lemoncode_:

```diff
p:after {
content: "... [Ver más]"
cursor: pointer;
}

+ div.myclass::before {
+ content: "©";
+ padding-right: 6px;
+ font-weight: bold;
+ }
```