# In this demo we are going to build a semantic grid.

- One of the most interesting properties of a grid container is the chance to describe `areas`. We can use `grid-template-areas` on conatiner in combination with `grid-area`property on grid items to get a semantic grid.

- The idea is that the structure itself describe the grid layout. This is great because just in a glance we can understand how the space is going to be managed.

- `grid-template-areas`: Defines a grid template by referencing the names of the grid areas which are specified with the grid-area property. Repeating the name of a grid area causes the content to span those cells. A period signifies an empty cell.

### 1. Lets start by placing the following html.

```html index.html
<body>
  <div class="container">
    <div class="item-a">
      <p>Header</p>
    </div>
    <div class="item-b">
      <p>Main</p>
    </div>
    <div class="item-c">
      <p>Sidebar</p>
    </div>
    <div class="item-d">
      <p>Footer</p>
    </div>
  </div>
</body>
```

### 2. Now lets define our grid and its children.

```css style.css
.container {
  display: grid;
  height: 50vh;
  grid-template-columns: 1fr 1fr 1fr 1fr; /*1*/
  grid-template-rows: auto; /*2*/
  grid-template-areas: /*3*/
    "header header header header"
    "main main . sidebar"
    "footer footer footer footer";
}

.item-a {
  grid-area: header; /*4*/
  background-color: deeppink;
}

.item-b {
  grid-area: main;
  background-color: darkgreen;
}

.item-c {
  grid-area: sidebar;
  background-color: deepskyblue;
}

.item-d {
  grid-area: footer;
  background-color: chartreuse;
}
```

1. This unit it is related to get free space proportional. For example if the first column get 100px and the next column has 1fr, that means get the 100% of the remaining space.

2. Gets the height proportional in all rows. This is going to be handle by browsers.

3. Here is where we are defining the actual grid layout. A `.` means that this cell is empty. Remind that we are spaning the cells by repeating the name area.

4. We define the styles that are related with the area.

### 2. Another property that is intesting and we can play with is the gap between rows and colimns.

- `grid-column-gap/grip-row-gap`: Specifies the size of the grid lines. You can think of it like setting the width of the gutters between the columns/rows.

```diff
.container {
    display: grid;
    height: 50vh;
    grid-template-columns: 1fr 1fr 1fr 1fr; /*1*/
    grid-template-rows: auto; /*2*/
    grid-template-areas: /*3*/
        "header header header header"
        "main main . sidebar"
        "footer footer footer footer";
+   grid-column-gap: 5px;
+   grid-row-gap: 5px;
}
```
