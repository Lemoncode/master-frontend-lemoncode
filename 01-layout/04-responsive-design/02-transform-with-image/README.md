# Module 1 - Layout

# Responsive design images

## Steps:

### 1. Create a basic HTML. This is the starting point for demo.

- The styles goes on the head of document.

- If we use codepen.io use this url: http://cdn.20m.es/img2/recortes/2015/08/05/235953-944-664.jpg?v=20150805182807

```html
<style type="text/css">
  body {
    width: 90%; /* initial width */
    margin: 0 auto;
    font-size: 1.3em;
  }

  .span-1,
  .span-2,
  .span-3 {
    min-height: 150px;
    float: left;
    margin-right: 3.33333%; /* 10 / 300 = .0333 */
    margin-bottom: 10px;
  }

  .span-1 {
    width: 30%; /* 90 / 300 = .3 */
    background-color: red;
  }

  .span-2 {
    width: 63.33333%; /* 190 / 300 = .6333 */
    background-color: blue;
  }

  .span-3 {
    width: 96.66666%; /* 290 / 300 = .9666 */
    background-color: lightgreen;
  }
</style>

<body>
  <div class="span-3">
    <h1>The Piggy Poem.</h1>
    <p>
      <img src="./content/toad.jpg" alt="a lovely pig" />
      In England once there lived a big And wonderfully clever pig. To everybody it was plain That Piggy had a massive
      brain.
    </p>
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

### 2. Let's go to proportional, using percetages.

```diff style
+img {
+  max-width: 100%; /*You can read this as get as maximun the 100% of your parent container*/
+  float: right;
+}
```
