# Module 1 - Layout

# Specifity

## Steps:

### 1. Create a basic HTML

```html
<body>
  <section class="container">
    <p>I am a lonely &ltp&gt</p>
    <div>
      <p>I am a &ltp&gt inside a div</p>
      <p class="red">I am red?</p>
      <p class="red" id="lemoncode">I am a &ltp&gt inside a div, but I have an id!</p>
    </div>
  </section>
</body>
```

#### Note: For demos we will use an online font: @import 'https://fonts.googleapis.com/css?family=Raleway'; Not used in this example

### Specifity Notes

- It turns out that the browser gives each style rule a specifity raiting, which is a way to quantify the importance of the rule. The higher specifity number, the more important the rule is. You can think of the specifity number as consisting of three parts ABC
  - C => Count of type selectors
  - B => Count of class and attributes selectors that are in a rule
  - A => Count of ID selectors

| Selector |     ABC     | Value |
| :------- | :---------: | :---: |
| \*       | a=0,b=0,c=0 |   0   |
| LI       | a=0,b=0,c=1 |   1   |
| UL LI    | a=0,b=0,c=2 |   2   |
| LI.red   | a=0,b=1,c=1 |  11   |
| #content | a=1,b=0,c=0 |  100  |

- Rules that have a higher number here will win out over rules that target the same element but have a lower number.

## Steps:

### 1. We start by applying this css.

```css
body {
  font-family: monospace;
  font-size: 3rem;
}
```

### 2. We add an style with \* selector. Watch results

```diff
+ * {
+    color: deeppink;
+}
```

### 3. We add an style to type selector. Watch results

```diff
+p {
+    color: white
+}
```

### 4. Add now a rule with two type selector. Watch results.

```diff
+div p {
+    color: darkblue
+}
```

### 5. Add a class selector. Watch results.

```diff
+.red {
+    color: red;
+}
```

### 6. Add an ID selector and another class. Watch results.

```diff
+#lemoncode {
+    color: greenyellow;
+}
+
+.container {
+    width: 90%;
+    margin: 0 auto;
+    background: lightslategray;
+}
```
