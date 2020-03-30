# Module 1 - Layout

# Absolute Position

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

## Absolute Positioning Notes

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

#### Notice that the blue box it's now inside a div with the conatiner class.

### 2. Apply postion absolute the blue box

```diff
.blue-box {
    background: lightblue;
+    position: absolute;
}
```
#### Now we can see that the rest of elements move to the top of page. Even we stop watching the green box, that is already behind the blue one.

### 3. Lets add property bottom

```diff
.blue-box {
    background: lightblue;
    position: absolute;
+    bottom: 50px;
}
```
#### It seems to behave as fixed, but here there is a really big difference. After apply bottom:50px, we can see how the box moves to the bottom of window.

* But now if we play with the scroll bar up and down, we can see that takes the same position relative to the position on document, instead relative to the browser window, like on fixed positioning.

### 4. Let's change to fixed to notice difference.

```diff
.blue-box {
    background: lightblue;
-    position: absolute;
+    position: fixed;
+    bottom: 50px;
}
```

### 5. Now lets apply some height and width to container. And put blue box on absolute.

```diff
.blue-box {
    background: lightblue;
-    position: fixed;
+    position: absolute;
+    bottom: 50px;
}

.container {
    background: rgba(0, 0, 0, 0.4);
+    height: 200px;
+    width: 200px;
}
```

### 6. Let's remove the 50 px bottom

```diff
.blue-box {
    background: lightblue;
    position: absolute;
-    bottom: 50px;
}
```

#### Now the blue box move to the top left corner. Here is where it will going to be displayed even if the absolute positioning was not applied. Let's play with the box and  container and see what happens.

### 7. Apply a top margin to our container.

```diff
.container {
    background: rgba(0, 0, 0, 0.4);
    height: 200px;
    width: 200px;
+   margin-top: 150px;    
}
```

* Now all the set (container and box it's moving together). The blue box noves with container because it's inside. The other elements are responding because even the blue box is set to absolute, the container box is not, so they are responding to the changes on container.

### 8. Let's add property top to our blue box.

```diff
.blue-box {
    background: lightblue;
    position: absolute;
+    top: 0px;
}
```

* We can see that our box moves to the top left corner.

### 9. Now we apply absolute position to the container.

```diff
.container {
    background: rgba(0, 0, 0, 0.4);
    height: 200px;
    width: 200px;
-   margin-top: 150px;    
+   position: absolute;
}
```

* Now the other elements on page igonore the width and height of our container (or set container + blue box), now the container has absolute positioning, so the rest of elements are ignoring its width and height.

### 10. Now let's apply margin to container again. 

```diff
.container {
    background: rgba(0, 0, 0, 0.4);
    height: 200px;
    width: 200px;
+   margin-top: 150px;    
   position: absolute;
}
```

* It moves from normal move of document, going 'down' 150px due to the top magin applied.

### 11. Let's remove the postion on container. 

```diff
.container {
    background: rgba(0, 0, 0, 0.4);
    height: 200px;
    width: 200px;
    margin-top: 150px;    
-   position: absolute;
}
```

* The blue box moves to the top left corner window. 

### 12. Play with top and left on blue box.

```diff
.blue-box {
    background: lightblue;
    position: absolute;
-    top: 0px;
+    top: 50px; /*100, 200... */
+    left: 100px; /*300, 500...*/
}
```
* The blue box moves relative to the top left corner window.

### 13. Let's change the container again to absolute.

```diff
.container {
    background: rgba(0, 0, 0, 0.4);
    height: 200px;
    width: 200px;
    margin-top: 150px;    
+   position: absolute;
}
```

* Now the blue box moves relative to container. Its movement 'origin' it's going to be the container's top left corner, and not the browser's window.

### 14. Now let's move the container.

```diff
.container {
    background: rgba(0, 0, 0, 0.4);
    height: 200px;
    width: 200px;
    margin-top: 150px;    
    position: absolute;
+    top: 100px;
}
```

* The blue box remains in the same position relative to its container.

### 15. Remove positioning on container.

```diff
.container {
    background: rgba(0, 0, 0, 0.4);
    height: 200px;
    width: 200px;
    margin-top: 150px;    
-    position: absolute;
-    top: 100px;
}
```

* For last if we remove container positioning the blue box moves relative to browser