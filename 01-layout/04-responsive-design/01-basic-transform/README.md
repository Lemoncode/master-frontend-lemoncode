# Module 1 - Layout

# Responsive design

## Steps:

### 1. Create a basic HTML. This is the starting point for demo.

- The styles goes on the head of document.

```html
<style type="text/css">
  body {
    width: 300px; /* set the width */
    margin: 0 auto; /* center the content */
  }

  .span-1,
  .span-2,
  .span-3 {
    min-height: 100px;
    float: left;
    margin-right: 10px; /* all spans get margin-right */ /* 10 / 300 = 0.03333  */
    margin-bottom: 10px; /*It becomes 1% because 10 + 10 + 10 = 30; 30 / 300 = 0.1*/
  }

  .span-1 {
    width: 90px; /* one column, 90 + 10 = 100 */ /* 90 / 300 */
    background-color: red; /* so we can see it... */
  }

  .span-2 {
    width: 190px; /* two column, 190 + 10 = 200 */
    background-color: blue;
  }

  .span-3 {
    width: 290px; /* three column, 290 + 10 = 300 */
    background-color: lightgreen;
  }
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

### 2. Let's go to proportional, using percentages.

```diff
body {
        width: 300px;               /* set the width */
        margin: 0 auto;             /* center the content */
      }

      .span-1, .span-2, .span-3 {
        min-height: 100px;
        float: left;
-        margin-right: 10px;
+        margin-right: 1%;         /* all spans get margin-right */ /* 10 / 300 = 0.03333  */
        margin-bottom: 10px;        /*It becomes 1% because 10 + 10 + 10 = 30; 30 / 300 = 0.1*/
      }

      .span-1 {
-        width: 90px;
+        width: 32.33%;                /* one column, 90 + 10 = 100 */ /* 90 / 300 */1
        background-color: red;      /* so we can see it... */
      }

      .span-2 {
-        witdth: 190px;
+        width: 64.67%;               /* two column, 190 + 10 = 200 */
        background-color: blue;
      }

      .span-3 {
-        width: 290px;
+        width: 97%;               /* three column, 290 + 10 = 300 */
        background-color: lightgreen;
      }
```
