# Module 1 - Layout

# Static Position

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

### 2. We set the blue box to position static. 

```diff
.blue-box {
    background: lightblue;
+   position: static;    
}
```

* Nothing happens at all.

### 3. No we are going to start to give values to top, bottom, left...

```diff
.blue-box {
    background: lightblue;
    position: static;
+   top: 100px;    
}
```

* Nothing happens at all.

### 4. Change to relative

```diff
.blue-box {
    background: lightblue;
-    position: static;
+    position: relative;
    top: 100px;    
}
```

* Now the element starts to move. What this means is that static positioning is the default value of the element. So it's not going to respond to any change applied on positioning properties.

### 5. Change the blue box to position inherit

```diff
.blue-box {
    background: lightblue;
-    position: relative;
+    position: inherit;
    top: 100px;    
}

.container {
  background-color: rgba(0, 0, 0, 0.4);
+  width: 200px;
+  height: 200px;
}
```

* Inherits from its parent container. So right now it's static because .container has not applied any positioning.

### 6. Let's apply relative positioning to container.

```diff
.blue-box {
    background: lightblue;
    position: inherit;
-    top: 100px; 
+    top: 40px;    
}

.container {
  background-color: rgba(0, 0, 0, 0.4);
  width: 200px;
  height: 200px;
+  position: relative;
}
```

* Now the blue box moves relative to its parent, because inherits the relative positioning.

### 7. Let's move the green box. And change the blue box to relative position.

```diff
.blue-box {
  background-color: blue;
-  position: inherit;
+  position: relative;
-  top: 40px;
}

.green-box {
  background-color: green;
+  position: relative;
+  top: -150px;
}

.container {
  background-color: rgba(0, 0, 0, 0.4);
  width: 200px;
  height: 200px;
  position: relative;
}*/
```

* Now the green box it's over the blue box.

### 8. Change z-index on green box.
```diff
.green-box {
  background-color: green;
  position: relative;
  top: -150px;
  z-index: -1;
}
```

* With a negative value on green box. it moves behind the container and blue box. This property allow us to change the way that elements are stacked, on the z axis. It moves from negative to positive values. 