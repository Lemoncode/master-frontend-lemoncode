# Module 1 - Layout

# Inheritance

## Steps:

### 1. Create a basic HTML

```html
<body>
  <h1>Heading 1</h1>
  <h2>Heading 2</h2>
  <div>
    A div
    <em>emphasis</em>
    <strong>strong</strong>
  </div>
  <p>A paragraph</p>
  <div>
    <p>
      A paragraph inside a div
      <em>emphasis</em>
      <strong>strong</strong>
    </p>
  </div>
</body>
```

#### Note: For demos we will use an online font: @import 'https://fonts.googleapis.com/css?family=Raleway'; Not used in this example

### Inheritance Notes

- Some property values of an element will be inherited from the elements parent. There are certain properties that we could set on the parent element that will flow through and be inherited by all of the children underneath that element. One example is the font-size property. Instead border is an example of something that can not be inherited.

## Steps:

### 1. We start by applying this css. We can see that the nested elements of the div element has the 8px size.

```css
@import "https://fonts.googleapis.com/css?family=Raleway";

body {
  font-family: "Raleway", sans-serif;
}

a {
  text-decoration: none;
  color: black;
}

a:hover {
  color: greenyellow;
}

div {
  font-size: 8px;
}
```

### 2. Now lets apply a new rule to p element. We can watch two things, one that we can override the inherited styles, and two that the border is something, that can not be inherited. em and strong elements, has no border.

```diff
+p {
+    font-size: 22px;
+    border-style: solid;
+    border-width: 5px;
+}
```
