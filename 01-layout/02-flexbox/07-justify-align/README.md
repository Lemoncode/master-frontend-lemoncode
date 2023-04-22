# Justify and align

Vale, podemos mostrar los elementos, apilarlos pero nos interesar jugar con la posicion (justificacion) del contenido (Como con Ms Word), 

Vamos a ver que el posibilidades nos ofrece flexbox:

```html
<body>
  <div id="flex-container">
    <div class="box" id="box1">BOX 1</div>
    <div class="box" id="box2">BOX 2</div>
    <div class="box" id="box3">BOX 3</div>
  </div>
</body>
```

Borramos el css y limpiamos el body...

```css
body {
  margin: 0px;
  padding: 0px;
}
```

Vamos a definir el contenedor flex:

```diff
body {
  margin: 0px;
  padding: 0px;
}

+ #flex-container {
+ display: flex;
+ flex-direction: row;
+ border: 3px solid black;
+ }
```

Y vamos a indicar que todos los elementos hijos tendrán color, border y padding:

```diff
#flex-container {
  display: flex;
  flex-direction: row;
  border: 3px solid black;:
}

+ .box {
+ border: 1px solid black;
+ background-color: cadetblue;
+ padding: 30px;
+ }
```

Así que tenemos nuestro resultado habitual... en este ejemplo todos los elemento ocupan solo lo necesario y hay mucho espacio de sobra disponible.

Vamos a introducir algunos cambios:

- Incluimos el border en el box sizing.
- Cambiamos la direccion a column.
- Le damos al contenedor el alto completo del viewport.
- Vamos a jugar con el justify-content property
  (empezamos con el valor por defecto: _flex-start_)

```diff
#flex-container {
+ box-sizing: border-box;
+ height: 100vh;
  display: flex;
- flex-direction: row;
+ flex-direction: column;
  border: 3px solid black;
+ justify-content: flex-start;
}
```

Que pasa si queremos centar el contenido verticalmente? Solo tenemos que cambiar el justify-content y voila !

```diff
#flex-container {
box-sizing: border-box;
height: 100vh;
display: flex;
flex-direction: column;
border: 3px solid black;
- justify-content: flex-start;
+ justify-content: center;
}
```

Otra interesante valor para esta propiedad es _space-between_
que reparte en espacios sobrante para separa cada items.

```diff
#flex-container {
  box-sizing: border-box;
  height: 100vh;
  display: flex;
  flex-direction: column;
  border: 3px solid black;
- justify-content: center;
+ justify-content: space-between;
}
```

Vamos a crear una nueva row:

```diff
<div id="flex-container">
  <div class="box" id="box1">BOX 1</div>
  <div class="box" id="box2">BOX 2</div>
  <div class="box" id="box3">BOX 3</div>
+ <div class="box" id="box4">BOX 4</div>
</div>
```

Y si en vez de mostrar en una columna queremos mostrar en fila, solo tenemos que modificar el _flex-directio: row_

```diff
#flex-container {
  box-sizing: border-box;
  height: 100vh;
  display: flex;
- flex-direction: column;
+ flex-direction: row;
  border: 3px solid black;
  justify-content: space-between;
}
```

- Ahora mismo los elemento se estan mostrando estirados (ocupando todo el alto disponible), podemos jugar con el align items para mostrarlos todos en la parte superior ocupando solo el tamaño que necesiten:

```diff
#flex-container {
box-sizing: border-box;
height: 100vh;
display: flex;
flex-direction: row;
border: 3px solid black;
justify-content: space-between;
+ align-items: flex-start;
}
```

- Ahora queremos centrar el contenido horizontalmente (como el flex-direction es row, el eje principal es axis):

```diff
#flex-container {
box-sizing: border-box;
height: 100vh;
display: flex;
flex-direction: row;
border: 3px solid black;
- justify-content: space-between;
+ justify-content: center;
align-items: flex-start;
}
```

Y si queremos centrarlo verticalmente? align-items...

```diff
#flex-container {
box-sizing: border-box;
height: 100vh;
display: flex;
flex-direction: row;
border: 3px solid black;
justify-content: center;
- align-items: flex-start;
+ align-items: center;
}
```

Perfecto, Pero alguna veces tenemos items con diferentes tamaños, vamos a modificar el _html_ para ver como trabaja el _baseline_, Modificamos el tamaño de algunas cajas.

```diff
<div id="flex-container">
- <div class="box" id="box1">BOX 1</div>
+ <div class="box" id="box1"><h1>BOX 1</h1></div>
- <div class="box" id="box2">BOX 1</div>
+ <div class="box" id="box2"><h3>BOX 2</h3></div>
  <div class="box" id="box3">BOX 1</div>
  <div class="box" id="box4">BOX 1</div>
</div>
```

Vamos a crear un padding especifico para nuestra caja _box1_

```diff
.box {
  border: 1px solid black;
  background-color: cadetblue;
  padding: 30px;
}

+ #box1 {
+ padding-bottom: 70px;
+ }
```

Los textos no se muestran alineados, vamos a usar _align-items_ _baseline_

```diff
#flex-container {
box-sizing: border-box;
height: 100vh;
display: flex;
flex-direction: row;
border: 3px solid black;
justify-content: center;
- align-items: center;
+ align-items: baseline;
}
```

Y como hacemos que se apilen los elementos si no tenemos espacio disponible?

```diff
#flex-container {
  box-sizing: border-box;
  height: 100vh;
  display: flex;
  flex-direction: row;
+ flex-wrap: wrap;
  border: 3px solid black;
  justify-content: center;
  align-items: baseline;
}

.box {
  border: 1px solid black;
  background-color: cadetblue;
  padding: 30px;
+ width: 300px;  
}
```

Vale, ahora que tenemos la opcion de multilinea activa podemos jugar con la propiedas _align-content_. Vamos a centrar el contenido verticalmente.

```diff
#flex-container {
  box-sizing: border-box;
  height: 100vh;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  border: 3px solid black;
  justify-content: center;
  align-items: baseline;
+  align-content: center;
}
```
