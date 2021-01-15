# Module 1 - Layout

# Relative Position

## Steps:

### 1. Create a basic HTML

```html
<body>
    <div class="container">
        <div class="box blue-box"></div>
    </div>
    <div class="box green-box"></div>
</body>
``` 
#### Note: For demos we will use an online font: @import 'https://fonts.googleapis.com/css?family=Raleway';

## Relative Positioning Notes

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

.green-box {
  background-color: green;
}

.container {
    background: rgba(0, 0, 0, 0.4);
}
```
### 2. We set the postion of our blox to relative.

```diff
.blue-box {
    background: lightblue;
+   position: relative;
}
```

* It seems that nothing happens.

### 3. Change to absolute.

```diff
.blue-box {
    background: lightblue;
-   position: relative;
+   position: absolute;
}
```

* Now we can see that the other elements are ignoring the height and width of the box.

### 4. Change to relative.

```diff
.blue-box {
    background: lightblue;
-   position: absolute;
+   position: relative;
}
```
* When we go back to relative, what it's happening that the height and width of the original element reminds. It's not getting out of the normal flow document. This is the principal difference with absolute positioning.

### 5. Apply top to blue box.

```diff
.blue-box {
    background: lightblue;
    position: relative;
+   top: 250px;    
}
```

### 6. Let's apply bottom instead of top.

```diff
.blue-box {
    background: lightblue;
    position: relative;
-   top: 250px;
+   bottom: 0px;    
}
```

* Another important difference is that positioning it's been calculated to it's original position on document. The best way to understand this to compare it with absolute. If we have absolute positioning and 0px bottom, the element goes to the bottom of window browser. But if it's relative it's calculated reltive to its original position.

### 7. Play with different values of bottom. Relize how it moves.

```diff
.blue-box {
    background: lightblue;
    position: relative;
+   bottom: 10px; /*20, 100, ...*/    
}
```

### 8. Now let's give positioning to its parent.

```diff
.blue-box {
  background-color: blue;
  position: relative;
+  bottom: 0px;
}

.container {
+  background-color: rgba(0, 0, 0, 0.4);
+  width: 200px;
+  height: 200px;
+  position: relative;
}
```
* With relative postioning nothing changes at all, because it's calculated relative to its original position.

### 9. Let's move the container.

```diff
.blue-box {
  background-color: blue;
  position: relative;
  bottom: 0px;
}

.container {
  background-color: rgba(0, 0, 0, 0.4);
  width: 200px;
  height: 200px;
  position: relative;
+  top: 200px;
}
```

* The blue box moves reltive to its parent. So all the set moves together.

### 10. Remove the blue box positioning

```diff
.blue-box {
  background-color: blue;
-  position: relative;
-  bottom: 0px;
}
```

* The blue box still moves with its parent. THis is because the blue box inherit the relative positioning.

### 11. Change blue box to absolute.

```diff
.blue-box {
    background: lightblue;
+    position: absolute;
+    bottom: 0px;
}
```
* It's going to calculate its position relative to its parent. In this case the container. 

### 12. Change blue  box to relative.

```diff
.blue-box {
    background: lightblue;
-    position: absolute;
+    position: relative;
    bottom: 0px;
}
```

* Of course if we change to relative it will calculate its positioning relative to its parent.