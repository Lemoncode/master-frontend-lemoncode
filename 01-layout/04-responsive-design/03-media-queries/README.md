# Module 1 - Layout

# Responsive media queries

## Steps:

### 1. Create a basic HTML. This is the starting point for demo.

- The styles goes on the head of document.

- If we use codepen.io use this url: http://cdn.20m.es/img2/recortes/2015/08/05/235953-944-664.jpg?v=20150805182807

```html
<style type="text/css">
  body {
    width: 75%; /* set the width */
    margin: 0 auto; /* center the content */
  }

  .span-1,
  .span-2,
  .span-3 {
    min-height: 100px;
    float: left;
    margin-right: 3.33%; /* all spans get margin-right */ /* 10 / 300 = 0.03333  */
    margin-bottom: 10px;
  }

  .span-1 {
    width: 30%; /* one column, 90 + 10 = 100 */ /* 90 / 300 */
    background-color: red; /* so we can see it... */
  }

  .span-2 {
    width: 63.33%; /* two column, 190 + 10 = 200 */
    background-color: blue;
  }

  .span-3 {
    width: 96.66%; /* three column, 290 + 10 = 300 */
    background-color: lightgreen;
  }
  /*set media queries about orientation*/
</style>

<body>
  <div class="span-3">
    <p>Spanning three columns.</p>
  </div>

  <div class="span-1">
    <p>Spanning one column.</p>
  </div>

  <div class="span-2">
    <p>Spanning two columns.</p>
  </div>

  <div class="span-1">
    <p>Spanning one column.</p>
  </div>

  <div class="span-1">
    <p>Spanning one column.</p>
  </div>

  <div class="span-1">
    <p>Spanning one column.</p>
  </div>
</body>
```

- Get a view of starting point

### 2. We are going to apply some media queries to modify the design on the different widths.

```diff style
+@media screen and (min-width: 1024px) {
+        .span-1 {
+          background-color: magenta;
+          color: white;
+        }
+
+        .span-2 {
+          background-color: cyan;
+          color: white;
+        }
+
+        .span-3 {
+          background-color: #00cc99;
+          color: white;
+        }
+      }
+
+      @media screen and (min-width: 1023px) and (max-width: 768px) {
+        .span-1 {
+          width: 30%;
+          background-color: red;
+        }
+
+        .span-2 {
+          width: 63.33%;
+          background-color: blue;
+        }
+
+        .span-3 {
+          width: 96.66%;
+          background-color: lightgreen;
+        }
+      }
+
+      @media screen and (max-width: 767px) {
+        .span-1 {
+          width: 100%;
+        }
+
+        .span-2 {
+          width: 100%;
+        }
+
+        .span-3 {
+          width: 100%;
+        }
+      }
```
