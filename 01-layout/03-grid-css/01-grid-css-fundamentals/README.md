# In this demo we are going to start to work with CSS grid.

## Before get started with `grid` there is some terminology that it's good to know.

### Grid Container

* The element on which `display: grid` is applied. It's the direct parent of all the grid items. 

### Grid Item

* Direct descendants of grid. The grand child items are not grid items.

### Grid Line

* The dividing lines that make up the structure of the grid. They can be either vertical ("column grid lines") or horizontal ("row grid lines") and reside on either side of a row or column.

### Grid Track

* The space between two adjacent grid lines. You can think of them like the columns or rows of the grid. 

### Grid Cell

* The space between two adjacent row and two adjacent column grid lines. It's a single "unit" of the grid.

### Grid Area

* The total space surrounded by four grid lines. A grid area may be comprised of any number of grid cells.

### Note:

* float, display: inline-block, display: table-cell, vertical-align and column-* properties have no effect on a grid item.

* We will use this html as start point

```html
<div class="container">
    <div class="item"></div>
    <div class="item"></div>
    <div class="item"></div>
</div>
```

```css
.container {
    margin: 2em;
    background-color: grey;
}

.item {
    height: 20vh;
    padding: 2rem;
    box-sizing: border-box;
    border: 2px solid black;
    background-color: #5a5a5a;
}
```
## If we run our application right now, what we see is that we have three divs stacked.

### 1. Lets start using grid. To use it we have to select a grid container, in this case will be the div that has the class container.

```diff
.container {
    margin: 2em;
    background-color: grey;
+   display: grid;
}
```

* We can use as well `inline-grid`, this way the grid will not break into a new line.

### 2. We have to define the grid templates columns and rows. This is basic to have a grid.

```diff site.css
.container {
    margin: 2em;
    background-color: grey;
    display: grid;
+   grid-template-columns: 200px 30% auto;
+   grid-template-rows: 25% 100px auto;
+   min-height: 50vh;
}
....

-.item {
-    height: 20vh;
-    padding: 2rem;
-    box-sizing: border-box;
-    border: 2px solid black;
-    background-color: #5a5a5a;
-}
```

```diff index.html
<div class="container">
-    <div class="item"></div>
-    <div class="item"></div>
-    <div class="item"></div>
</div>
```

* `grid-template-columns/grid-template-rows`: Defines the columns and rows of the grid with a space-separated list of values. The values represent the track size, and the space between them represents the grid line.

* If we run our app now and use the developer tools we can find out our grid.  Chrome dev tools use dashed lines so we can watch our grid. 

### 3. Now that we have define a template for the rows and columns, we can start to place the grid items inside.

```diff index.html
<div class="container">
+    <div class="item-a"></div>
+    <div class="item-b"></div>
+    <div class="item-c"></div>
</div>
```

```diff site.css
+.item-a {
+    grid-column-start: 1;
+    grid-column-end: 2;
+    grid-row-start: 1;
+    grid-row-end: 4;
+    background-color: crimson;
+}
+
+.item-b {
+    grid-column-start: 2;
+    grid-column-end: 3;
+    grid-row-start: 1;
+    grid-row-end: 4;
+    background-color: orchid;
+}
+
+.item-c {
+    grid-column-start: 3;
+    grid-column-end: 4;
+    grid-row-start: 1;
+    grid-row-end: 4;
+    background-color: skyblue;
+}
```

* Here we are using the number of line (number of row and column) to define what is the space that our items have to take place inside our grid.

* Notice that the is one index based.

### 4. Notice that we have created three columns, how we have to change our items to get three rows?


```diff site.css
.item-a {
    grid-column-start: 1;
-   grid-column-end: 2;
+   grid-column-end: 2;
    grid-row-start: 1;
-   grid-row-end: 4;
+   grid-row-end: 4;
    background-color: crimson;
}

.item-b {
-   grid-column-start: 2;
-   grid-column-end: 3;
+   grid-column-start: 1;
+   grid-column-end: 4;
-   grid-row-start: 1;
-   grid-row-end: 4;
+   grid-row-start: 2;
+   grid-row-end: 3;
    background-color: orchid;
}

.item-c {
-   grid-column-start: 3;
+   grid-column-start: 1;
    grid-column-end: 4;
-   grid-row-start: 1;
+   grid-row-start: 3;
    grid-row-end: 4;
    background-color: skyblue;
}

```