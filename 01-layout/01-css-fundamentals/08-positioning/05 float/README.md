# Module 1 - Layout

# Float Position

## Steps:

### 1. Create a basic HTML

```html
<body>
    <div class="box blue-box"></div>
    <h1>Som text that I wrote....</h1>
    <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </p>
    <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </p>
</body>
``` 
#### Note: For demos we will use an online font: @import 'https://fonts.googleapis.com/css?family=Raleway';

## Float Positioning Notes

### 1. We start with this css. Watch on browser how it looks.

```css
body {
    font-family: 'Raleway', sans-serif;
    background-color: darkgrey;
    color: #0b0b0b;
    height: 2000px;
}

.box {
  width: 100px;
  height: 100px;
  margin-bottom: 10px;
}

.blue-box {
    background: lightblue;
}
``` 

### 2. Let's apply float to the blue box.

```diff
.blue-box {
    background: lightblue;
+   float: left;
}
```
* When we apply float, the rest of elements don't ignore its width and height. The rest of elelments move up, flowing around the element.

* What float does it's to remove the element from the document flow, and push it to the left, how much as it is possible.

### 3. Let's change to float to right
```diff
.blue-box {
    background: lightblue;
-   float: left;
+   float: right;
}
```
* right does the simetric operation.

### 4. Let's add now the green box.

```diff html
<div class="box blue-box"></div>
+<div class="box green-box"></div>
<h1>Some text that I wrote....</h1>
```

```diff
+.green-box {
+    background: green;
+}
```

* What happens now it's that text it's not flowing like before. Why? Because the green box it's avoiding the flow.

### 5. Now if we use float on green the text flows again. 

```diff
.box {
  width: 100px;
  height: 100px;
  margin-bottom: 10px;
+  margin-right: 10px;
}

.blue-box {
    background: lightblue;
-   float: right;
+   float: left;
}

.green-box {
    background: green;
+    float: left;
}
```

### 6. Imagine, that we want the two boxes consecutive, but the text does not flow up. To achieve this we have to use clear, to the first element where we want to stop flow up.

```diff
+h1 {
+    font-weight: normal;
+    clear: left;
+}
```

### 7. Change boxes to float right

```diff
.blue-box {
    background: lightblue;
-   float: left;
+   float: right;
}

.green-box {
    background: green;
-    float: left;
+   float: right;
}
```
* Now clear it's not working. We have to align this property with the float direction.

### 8. Change clear to the right.

```diff
h1 {
    font-weight: normal;
-    clear: left;
+    clear: right;
}
```
* Now it's working again.

### 9. Change clear to both

```diff
h1 {
    font-weight: normal;
-    clear: right;
+    clear: both;
}
```
* This way we can ensure that we are cleaning to the right and to the left.

### 10. Make float boxes on oposite directions.

```diff
.blue-box {
    background: lightblue;
-   float: right;
+   float: left;
}

.green-box {
    background: green;
    float: right;
}
```

* Now each box is in the oposite side.
