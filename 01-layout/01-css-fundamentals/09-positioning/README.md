# Position

Vamos a probar el posicionamiento con un HTML con varios parrafos:

```html
<body>
  <p>Positioning</p>
  <div class="box"></div>
  <div class="box" id="element"></div>
  <div class="box"></div>
  <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam dignissim,
    ligula eu porta semper, mauris arcu volutpat est, ac consequat dui lorem
    cursus odio. In ante quam, sagittis a volutpat in, porttitor vel sapien.
    Nulla pharetra, elit vitae congue dictum, quam enim semper ipsum, sit amet
    dictum sapien nisi at tellus. Fusce eleifend sapien tempor quam iaculis, a
    luctus arcu consequat. In congue libero pulvinar augue tincidunt lacinia.
    Aenean leo nulla, ultricies quis tellus eu, condimentum laoreet augue. Etiam
    finibus tortor felis, vitae luctus tellus ornare quis. Nullam eget eros
    erat. Curabitur at metus tempus, sodales quam a, ullamcorper metus.
    Suspendisse varius magna nec tellus luctus, nec lacinia quam tincidunt.
    Integer finibus dui id erat ullamcorper porta. Maecenas erat tortor, mollis
    vel pulvinar et, imperdiet sit amet felis.
  </p>
  <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam dignissim,
    ligula eu porta semper, mauris arcu volutpat est, ac consequat dui lorem
    cursus odio. In ante quam, sagittis a volutpat in, porttitor vel sapien.
    Nulla pharetra, elit vitae congue dictum, quam enim semper ipsum, sit amet
    dictum sapien nisi at tellus. Fusce eleifend sapien tempor quam iaculis, a
    luctus arcu consequat. In congue libero pulvinar augue tincidunt lacinia.
    Aenean leo nulla, ultricies quis tellus eu, condimentum laoreet augue. Etiam
    finibus tortor felis, vitae luctus tellus ornare quis. Nullam eget eros
    erat. Curabitur at metus tempus, sodales quam a, ullamcorper metus.
    Suspendisse varius magna nec tellus luctus, nec lacinia quam tincidunt.
    Integer finibus dui id erat ullamcorper porta. Maecenas erat tortor, mollis
    vel pulvinar et, imperdiet sit amet felis.
  </p>
  <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam dignissim,
    ligula eu porta semper, mauris arcu volutpat est, ac consequat dui lorem
    cursus odio. In ante quam, sagittis a volutpat in, porttitor vel sapien.
    Nulla pharetra, elit vitae congue dictum, quam enim semper ipsum, sit amet
    dictum sapien nisi at tellus. Fusce eleifend sapien tempor quam iaculis, a
    luctus arcu consequat. In congue libero pulvinar augue tincidunt lacinia.
    Aenean leo nulla, ultricies quis tellus eu, condimentum laoreet augue. Etiam
    finibus tortor felis, vitae luctus tellus ornare quis. Nullam eget eros
    erat. Curabitur at metus tempus, sodales quam a, ullamcorper metus.
    Suspendisse varius magna nec tellus luctus, nec lacinia quam tincidunt.
    Integer finibus dui id erat ullamcorper porta. Maecenas erat tortor, mollis
    vel pulvinar et, imperdiet sit amet felis.
  </p>
  <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam dignissim,
    ligula eu porta semper, mauris arcu volutpat est, ac consequat dui lorem
    cursus odio. In ante quam, sagittis a volutpat in, porttitor vel sapien.
    Nulla pharetra, elit vitae congue dictum, quam enim semper ipsum, sit amet
    dictum sapien nisi at tellus. Fusce eleifend sapien tempor quam iaculis, a
    luctus arcu consequat. In congue libero pulvinar augue tincidunt lacinia.
    Aenean leo nulla, ultricies quis tellus eu, condimentum laoreet augue. Etiam
    finibus tortor felis, vitae luctus tellus ornare quis. Nullam eget eros
    erat. Curabitur at metus tempus, sodales quam a, ullamcorper metus.
    Suspendisse varius magna nec tellus luctus, nec lacinia quam tincidunt.
    Integer finibus dui id erat ullamcorper porta. Maecenas erat tortor, mollis
    vel pulvinar et, imperdiet sit amet felis.
  </p>
  <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam dignissim,
    ligula eu porta semper, mauris arcu volutpat est, ac consequat dui lorem
    cursus odio. In ante quam, sagittis a volutpat in, porttitor vel sapien.
    Nulla pharetra, elit vitae congue dictum, quam enim semper ipsum, sit amet
    dictum sapien nisi at tellus. Fusce eleifend sapien tempor quam iaculis, a
    luctus arcu consequat. In congue libero pulvinar augue tincidunt lacinia.
    Aenean leo nulla, ultricies quis tellus eu, condimentum laoreet augue. Etiam
    finibus tortor felis, vitae luctus tellus ornare quis. Nullam eget eros
    erat. Curabitur at metus tempus, sodales quam a, ullamcorper metus.
    Suspendisse varius magna nec tellus luctus, nec lacinia quam tincidunt.
    Integer finibus dui id erat ullamcorper porta. Maecenas erat tortor, mollis
    vel pulvinar et, imperdiet sit amet felis.
  </p>
</body>
```

Borramos la hoja de estilo.

Vamos a jugar con los estilos del elemento _div_ que tiene como id _element_

Definimos un estilo a la clase _box_:

```css
.box {
  width: 100px;
  height: 100px;
  margin-bottom: 10px;
  background-color: lightblue;
  border: 3px solid darkblue;
}
```

Vamos a establecer la propiedad _display_ a _inline-block_ para que todos los divs se muestren en la misma linea de izquierda a derecha:

```diff
.box {
+ display: inline-block;
  width: 100px;
  height: 100px;
  margin-bottom: 10px;
  background-color: lightblue;
  border: 3px solid darkblue;
}
```

Vamos a cambiar el color a la caja con id _element_

```diff
.box {
  display: inline-block;
  width: 100px;
  height: 100px;
  margin-bottom: 10px;
  background-color: lightblue;
  border: 3px solid darkblue;
}

+ #element {
+   background-color: darkorange;
+   border: 3px solid brown;
+ }
```

Empecemos por ver que pasa si marcamos la posicion como static (por defecto)

```diff
#element {
+ position: static;
  background-color: darkorange;
  border: 3px solid brown;
}
```

Si intentamos modiciar las propiedades top o left no pasa nada, solo podemos jugar con las propiedades margin y padding...

Pero, que pasaría si establecemos la posicion a _relative_

```diff
#element {
- position: static;
+ position: relative;
+ top: 120px;
+ left: 80px;
  background-color: darkorange;
  border: 3px solid brown;
}
```

El elemento se ha movido a una nueva posición, pero el original espacio se ha reservado, esta es una de las diferencias entre absoluto y relativo.

Si cambiamos a absoluto:

```diff
#element {
- position: relative;
+ position: absolute;
  top: 120px;
  left: 80px;
  background-color: darkorange;
  border: 3px solid brown;
}
```

Ahora el elemento esta posicionado tomando como referencia el primer elemento padre que este posicionado (en este caso el body), y se sale del flujo original, por tanto el espacio reservado desaparece.

Pero.. si bajamos el scrol, el elemento se desplazará. Si no queremos este comportamiento podemos probar con el posicionamiento _fixed_.

```diff
#element {
- position: absolute;
+ position: fixed;
  top: 120px;
  left: 80px;
  background-color: darkorange;
  border:
```

Parece que tiene el mismo comportamiento, pero si bajamos el scroll... sorpresa!

Y por último, otro posicionamiento importante es _sticky_ que nos permite conseguir un comportamiento parecido _fixed_ pero definiendo un rango de espacio.

```diff
#element {
- position: fixed;
+ position: sticky;
- top: 120px;
+ top: 0px;
- left: 80px;
+ left: 50px;
  background-color: darkorange;
  border: 3px solid brown;
}
```
