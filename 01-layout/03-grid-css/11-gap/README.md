# Gap

Vamos a borrar el ejemplo anterior y comenzamos con este html:

```diff
<body>
<div class="grid-container">
+ <div class="item">1</div>
+ <div class="item">2</div>
+ <div class="item">3</div>
+ <div class="item">4</div>
+ <div class="item">5</div>
+ <div class="item">6</div>
</div>
</body>
```

```css
body {
  margin: 0;
  padding: 0;
}
.grid-container {
  display: inline-grid;
  border: 1px solid blue;
  grid-template-columns: repeat(3, 100px);
  grid-auto-rows: 100px;
}
.item {
  border: 1px solid black;
}
```

Podemos añadir un espacio entre los elementos columnas o row:

```diff
.grid-container {
  display: inline-grid;
  border: 1px solid blue;
  grid-template-columns: repeat(3, 100px);
  grid-auto-rows: 100px;
+ row-gap: 15px;
+ column-gap: 18px;
}
```

Podemos usar un shothand:

```diff
.grid-container {
  display: inline-grid;
  border: 1px solid blue;
  grid-template-columns: repeat(3, 100px);
  grid-auto-rows: 100px;
- row-gap: 15px;
- column-gap: 18px;
+ gap: 15px 18px;
}
```
