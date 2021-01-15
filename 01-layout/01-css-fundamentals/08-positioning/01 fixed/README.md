# Module 1 - Layout

# Fixed Position

## Steps:

### 1. Create a basic HTML

```html
<body>
    <div class="box blue-box"></div>
    <div class="box green-box"></div>
</body>
``` 
#### Note: For demos we will use an online font: @import 'https://fonts.googleapis.com/css?family=Raleway';

## Fixed Positioning Notes

* Fixed Positioning 'fixes' the position of an element relative to the browser window. The element always stays fixed in place, even when scrolling. 

### 1. We start with this css. Watch on browser how it looks.

```css
body {
    background-color: #1f1f1f;
    color: #bfbfbf;
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
    background: lightgreen;
}

```

### 2. To apply positioning to an element we have to play with the keyword position. Lets apply fixed position to .blue-box.

```diff
.blue-box {
    background: lightblue;
+    position: fixed;
}
```  

### 3. Move blue box from top.

#### Note that the green box disapears, or that looks like. Too figure out waht is going on here, we have 4 chances to move the blue box on 4 different directions: top, bottom, right, left. It's very important to know that we can move the box, because we have applied position to box.


```diff
.blue-box {
    background: lightblue;
+    position: fixed;
+    top: 150px;
}
```  
#### Once we have applied this positioning the blue box moves 150px on 'y' axis. The other elements are completly ignoring this box, so when we apply this the other elements ignore the width and height of this box (that is because green box it's on its place). If we remove the 150px on top, what happens, is that the blue box it's over the green box

### 4. Remove top value.

```diff
.blue-box {
    background: lightblue;
    position: fixed;
-    top: 150px;
}
```  

#### If we remove the 150px on top, what happens, is that the blue box it's over the green box, so we can't see the green box. But when we move the blue box, the green box appears again.

### 5. Apply two contradictory movements. 

```diff
.blue-box {
    background: lightblue;
    position: fixed;
    top: 150px;
+   bottom: 150px;
}
```
#### Although the browser it's applying just one of them, it has no sense, we can only have one value per axis.

### 5. Lets add left property. 

```diff
.blue-box {
    background: lightblue;
    position: fixed;
    top: 150px;
-   bottom: 150px;
+   left: 150px;
}
```
#### We can see how we are moving on x axis direction.

### 6. Lets add some height to body.

```diff
body {
    background-color: #1f1f1f;
    color: #bfbfbf;
+    height: 2000px;
}
```

* On thing really important about fixed positioning is that the position it's realtive to browser's window!!!!.

#### Now the browser displays the vertical scroll bar. Now  when we play with the scrolbar we can watch the effect of fixed positioning. The element is always at the same distance, relative to browser window. It's going to stay always in the same point, so it's fixed. 