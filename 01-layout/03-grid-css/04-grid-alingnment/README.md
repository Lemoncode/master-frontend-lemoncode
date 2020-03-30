# In this demo we are going to play with grid alignment.

* We start from this html and css

```html index.html
<body>
    <div class="container">
        <div class="item-a">
            <p>Glamour style sheets!!</p>
        </div>
        <div class="item-b">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</p>
        </div>
        <div class="item-c">
            <p>On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish.</p>
        </div>
        <div class="item-d">
            <p>About Glamour style sheets</p>
        </div>
    </div>
</body>
```


```css site.css
.container {
    display: grid;
    height: 90vh;
    grid-template-columns: 1fr 1fr 1fr 1fr; /*1*/
    grid-template-rows: auto; /*2*/
    grid-template-areas: /*3*/
        "header header header header"
        "main main . sidebar"
        "footer footer footer footer"
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

### 1. Now with this on place lets start to use aligning properties. The first one that we are going to use is `justify-items`.

* `justify-items`: Aligns grid items along the inline (row) axis.This value applies to all grid items inside the container.

* `start`: aligns items to be flush with the start edge of their cell
* `end`: aligns items to be flush with the end edge of their cell
* `center`: aligns items in the center of their cell
* `stretch`: fills the whole width of the cell (default)

```diff
.container {
    display: grid;
    height: 90vh;
    grid-template-columns: 1fr 1fr 1fr 1fr; /*1*/
    grid-template-rows: auto; /*2*/
    grid-template-areas: /*3*/
        "header header header header"
        "main main . sidebar"
        "footer footer footer footer";
    grid-column-gap: 5px;
    grid-row-gap: 5px;
+   justify-items: start;
}
```

* Both `header` and `footer` areas are not covering all the cells. This is because their content just get one cell in the header case, and footer gets a cell and a little bit of the next one.

* `mine` and `sidebar`, seems that haven't changed, this is because it contents push to get all the available space.

* If we change to `end` we got the specular result.

```diff
.container {
    display: grid;
    height: 90vh;
    grid-template-columns: 1fr 1fr 1fr 1fr; /*1*/
    grid-template-rows: auto; /*2*/
    grid-template-areas: /*3*/
        "header header header header"
        "main main . sidebar"
        "footer footer footer footer";
    grid-column-gap: 5px;
    grid-row-gap: 5px;
-   justify-items: start;
+   justify-items: end;
}
```

* If we change to `center` will center the elements.

```diff
.container {
    display: grid;
    height: 90vh;
    grid-template-columns: 1fr 1fr 1fr 1fr; /*1*/
    grid-template-rows: auto; /*2*/
    grid-template-areas: /*3*/
        "header header header header"
        "main main . sidebar"
        "footer footer footer footer";
    grid-column-gap: 5px;
    grid-row-gap: 5px;
-   justify-items: end;
+   justify-items: center;
}
```
* For last if we use `strech` we get default behavior.

### 2. We can align items along the column axis.

* `align-items`: Aligns grid items along the block (column) axis. This value applies to all grid items inside the container.

* `start`: aligns items to be flush with the start edge of their cell
* `end`: aligns items to be flush with the end edge of their cell
* `center`: aligns items in the center of their cell
* `stretch`: fills the whole height of the cell (this is the default)

```diff
.container {
    display: grid;
    height: 90vh;
    grid-template-columns: 1fr 1fr 1fr 1fr; /*1*/
    grid-template-rows: auto; /*2*/
    grid-template-areas: /*3*/
        "header header header header"
        "main main . sidebar"
        "footer footer footer footer";
    grid-column-gap: 5px;
    grid-row-gap: 5px;
    justify-items: stretch;
+   align-items: start;
}
```

* We can change to `end`, `center` and `strech` to watch different results.

* If we want to change the alignment of a single element or a set of elements instead of overall behavior, we have two properties:
    - `justify-self`: Aligns a grid item inside a cell along the inline (row) axis 
    - `align-self`: Aligns a grid item inside a cell along the block (column) axis

* `place-items`, set both the `align-items` and `justify-items`.