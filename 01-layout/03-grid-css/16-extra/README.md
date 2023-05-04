# Extra

Vamos a probar a "hacer" mas responsive nuestro grid.

Para ello vamos a partir de este ejemplo:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>CSS Grid</title>
    <meta charset="UTF-8" />
    <link rel="stylesheet" href="./style.css" />
  </head>

  <body>
    <div class="grid-container">
      <img src="./landscape-a.jpg" />
      <img src="./landscape-b.jpg" />
      <img src="./landscape-c.jpg" />
      <img src="./landscape-d.jpg" />
      <img src="./landscape-e.jpg" />
      <img src="./landscape-f.jpg" />
      <img src="./landscape-g.jpg" />
      <img src="./landscape-h.jpg" />
    </div>
  </body>
</html>
```

```css
body {
  font-family: sans-serif;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 160px);
  grid-gap: 20px;
  justify-content: space-around;
  overflow: auto;
}

.grid-container > img {
  width: 160px;
}
```

Comentamos este caso y el problema que tiene con diferentes resoluciones. Ventaja para Flex!

Vamos a modificar el css para crear columnas dependiendo del ancho de nuestro contenedor:

```diff
.grid-container {
  display: grid;
- grid-template-columns: repeat(3, 160px);
+ grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  grid-gap: 20px;
  justify-content: space-around;
  overflow: auto;
}

.grid-container > img {
- width: 160px;
+ width: 100%;
}
```

A tener en cuenta:

- minmax: Sirve para definir un valor dentro de un rango.
- auto-fill: crea nuevas celdas de minimo tamaño vacios cuando tiene espacio libre.
- auto-fit: reparte el espacio libre entre los elementos existentes.

La regla dice algo como "pinta tantas columnas como puedas que vayan de 160px hasta 1fr (el máximo espacio que esté disponible)"

Para ver las diferencia entre auto-fill y auto-fit, dejamos solo 3 elementos y aumentamos el tamaño del contenedor:

- con auto-fill: se crean los huecos de 160px aunque no tenga elemento.
- con auto-fit: los 3 elementos crecen porque no hay mas elementos.
