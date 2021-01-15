# Module 1 - Layout

# Border Margin Padding

## Steps:

### 1. Create a basic HTML

```html
<body>
  <ul>
    <li>
      <a href="http://www.w3.org/Style/CSS/">CSS specifications</a>
    </li>
    <li>
      <a href="http://www.csszengarden.com/">CSS Zen garden</a>
    </li>
    <li>
      <a href="http://www.blueprintcss.org/">Blueprint</a>
    </li>
    <li>
      <a href="http://www.developer.yahoo.com/yui/">YUI</a>
    </li>
  </ul>
</body>
```

#### Note: For demos we will use an online font: @import 'https://fonts.googleapis.com/css?family=Raleway'; Not used in this example

### Border Margin Padding The Box Model Notes

- A div, like every visual HTML element, will produce a box, and there are three key box properties on you can influence with CSS.
  - First is the border around the box. Most borders are not visible by default, but you can control the width, style, and color of this border.
  - Secondly is the padding. Padding adds space between the border of a box and the content of a box.
  - Lastly there is a margin. Margins are the space between the box and any adjacement elements.
- Of course box has four sides: Top, Right, Bottom, Left.

## Steps:

### 1. We start by applying this css. Watch the current

```css
@import "https://fonts.googleapis.com/css?family=Raleway";

body {
  font-family: "Raleway", sans-serif;
  /*background-color: gray;*/
}
```

### 2. Lets reset margin and padding for all elements. Watch results.

```diff
+* {
+    padding: 0px;
+    margin: 0px;
+}
```

### 3. We have anchor elements lets reset the styles provided by the browser as well.

```diff
+a {
+  text-decoration: none;
+  color: black;
+}
```

### 4. Now although we can see the bullets of li elements still there so lets remove them. And align text. For that purpose we will create .menu and apply to the ul element.

```diff
+.menu {
+  list-style-type: none;
+  text-align: center;
+}
```

```diff
+<body>
+    <ul class="menu">
+    ...
```

### 5. Lets change the hover of the li items.

```diff
+.menu li:hover {
+  background-color: #ffb380;
+}
```

### 6. Just to note the li items are displayed as list-iem (chrome at least), what that means, is that browser it is going to display these elements on stack. Lets change that.

```diff
+.menu li {
+  display: inline-block;
+}
```

### 7. Now we are going to assign a width and some properties to obtain a bottom in the menu items.

```diff
.menu li {
  display: inline-block;
+  width: 150px;
+  background-color: rgba(200, 200, 100, 0.5);
+  padding: 3px 0 0 10px;
+  border-bottom: 3px solid black;
+  border-left: 15px solid black;
}
```
