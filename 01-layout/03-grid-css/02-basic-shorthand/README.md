# In this demo we are going to use some shorthands to avoid boilerplate.

- We will use this html as start point

```html
<div class="container">
  <div class="item-a"></div>
  <div class="item-b"></div>
  <div class="item-c"></div>
</div>
```

```css
.container {
  margin: 2em;
  background-color: grey;
  display: grid;
  grid-template-columns: 200px 30% auto;
  grid-template-rows: 25% 100px auto;
  min-height: 50vh;
}

.item-a {
  grid-column-start: 1;
  grid-column-end: 4;
  grid-row-start: 1;
  grid-row-end: 2;
  background-color: crimson;
}

.item-b {
  grid-column-start: 1;
  grid-column-end: 4;
  grid-row-start: 2;
  grid-row-end: 3;
  background-color: orchid;
}

.item-c {
  grid-column-start: 1;
  grid-column-end: 4;
  grid-row-start: 3;
  grid-row-end: 4;
  background-color: skyblue;
}
```

### 1. The matter is that we have a lot of boilerplate to apply grid structure. So lets jump and use properties that can help us with this.

- We can use a short hand for `grid-column-start/grid-column-end` and `grid-row-start/grid-row-end`

```diff
.item-a {
-   grid-column-start: 1;
-   grid-column-end: 4;
-   grid-row-start: 1;
-   grid-row-end: 2;
+   grid-column: 1 / 4;
+   grid-row: 1 / 2;
    background-color: crimson;
}

.item-b {
-   grid-column-start: 1;
-   grid-column-end: 4;
-   grid-row-start: 2;
-   grid-row-end: 3; */
+   grid-column: 1 / 4;
+   grid-row: 2 / 3;
    background-color: orchid;
}

.item-c {
-   grid-column-start: 1;
-   grid-column-end: 4;
-   grid-row-start: 3;
-   grid-row-end: 4;
+   grid-column: 1 / 4;
+   grid-row: 3 / 4;
    background-color: skyblue;
}

```

### 2. Lets say now that we have columns or rows that are exactly the same. For these cases we can use `repeat` function.

```diff
.container {
    margin: 2em;
    background-color: grey;
    display: grid;
    grid-template-columns: 200px 30% auto;
-   grid-template-rows: 25% 100px auto;
+   grid-template-rows: repeat(2, 33%) 34%;
    min-height: 50vh;
}
```

- The first and the second row will have a height of 33% of available space, instead the third row, will have a 34%.

### 3. Instead of numbers we can name the start and end of columns/rows

```diff
.container {
    margin: 2em;
    background-color: grey;
    display: grid;
-   grid-template-columns: 200px 30% auto;
+   grid-template-columns: [column1-start] 200px 30% auto [column4-end];
    grid-template-rows: repeat(2, 33%) 34%;
    min-height: 50vh;
}

.item-a {
-   grid-column: 1 / 4;
+   grid-column: column1-start / column4-end;
    grid-row: 1 / 2;
    background-color: crimson;
}

.item-b {
-   grid-column: 1 / 4;
+   grid-column: column1-start / column4-end;
    grid-row: 2 / 3;
    background-color: orchid;
}

.item-c {
-   grid-column: 1 / 4;
+   grid-column: column1-start / column4-end;
    grid-row: 3 / 4;
    background-color: skyblue;
}
```

- If we use the same name as the case of `repeat` function, we can use the name and number.

### 4. When we set `grid-column/grid-row` property, we can use values to refer the number of cells that we are going to use on the track. Lets see an example to understand a little bit better this.

```diff
.item-a {
-   grid-column: column1-start / column4-end;
+   grid-column: column1-start / span 1;
    grid-row: 1 / 2;
    background-color: crimson;
}

.item-b {
-   grid-column: column1-start / column4-end;
+   grid-column: column1-start / span 2;
    grid-row: 2 / 3;
    background-color: orchid;
}

.item-c {
-   grid-column: column1-start / column4-end;
+   grid-column: column1-start / span 3;
    grid-row: 3 / 4;
    background-color: skyblue;
}
```
